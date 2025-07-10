
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameState, Player, World, Item, Ability, MapCell, Monster, QuestObjective, EquipmentSlot, EQUIPMENT_SLOTS, CombatAction, Vendor } from './types';
import { INITIAL_GAME_STATE, MAP_HEIGHT, MAP_WIDTH } from './constants';
import * as geminiService from './services/geminiService';
import * as fileUtils from './utils/fileUtils';

import GameScreen from './components/GameScreen';
import CombatScreen from './components/CombatScreen';
import CharacterSheet from './components/CharacterSheet';
import LogPanel from './components/LogPanel';
import ActionModal from './components/ActionModal';
import MenuScreen from './components/MenuScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import { LoadingIcon, PlayerIcon, MonsterIcon, ChestIcon, ExitIcon, QuestMarkerIcon, TrapIcon, VendorIcon, BackpackIcon } from './components/icons';
import PauseModal from './components/PauseModal';
import VendorScreen from './components/VendorScreen';
import InventoryScreen from './components/InventoryScreen';

const getEquipmentStats = (equipment: Player['equipment']) => {
    const totalStats = { strength: 0, dexterity: 0, intelligence: 0, defense: 0 };
    for (const slot in equipment) {
        const item = equipment[slot as EquipmentSlot];
        if (item && item.stats) {
            totalStats.strength += item.stats.strength || 0;
            totalStats.dexterity += item.stats.dexterity || 0;
            totalStats.intelligence += item.stats.intelligence || 0;
            totalStats.defense += item.stats.defense || 0;
        }
    }
    return totalStats;
};

const GameActions: React.FC<{
    onSave: () => void;
    onPause: () => void;
    onOpenInventory: () => void;
}> = ({ onSave, onPause, onOpenInventory }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg h-full">
            <h3 className="font-bold text-xl text-cyan-400 mb-3 border-b border-slate-600 pb-2">Actions</h3>
            <div className="flex flex-col gap-2">
                 <button onClick={onOpenInventory} className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded transition-colors flex items-center justify-center gap-2">
                    <BackpackIcon className="w-5 h-5"/>
                    Inventory (I)
                </button>
                <button onClick={onSave} className="w-full text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors">
                    Save Game
                </button>
                <button onClick={onPause} className="w-full text-sm bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded transition-colors">
                    Pause (ESC)
                </button>
            </div>
        </div>
    );
};

const Legend = () => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 shadow-lg h-full">
        <h3 className="font-bold text-xl text-cyan-400 mb-3 border-b border-slate-600 pb-2">Legend</h3>
        <ul className="space-y-1">
            <li className="flex items-center gap-2"><PlayerIcon className="w-5 h-5 text-cyan-400"/> Player</li>
            <li className="flex items-center gap-2"><MonsterIcon className="w-5 h-5 text-red-500"/> Monster</li>
            <li className="flex items-center gap-2"><ChestIcon className="w-5 h-5 text-amber-500"/> Treasure</li>
            <li className="flex items-center gap-2"><VendorIcon className="w-5 h-5 text-emerald-400"/> Vendor</li>
            <li className="flex items-center gap-2"><ExitIcon className="w-5 h-5 text-purple-500"/> Exit</li>
            <li className="flex items-center gap-2"><TrapIcon className="w-5 h-5 text-gray-400"/> Triggered Trap</li>
            <li className="flex items-center gap-2"><QuestMarkerIcon className="w-5 h-5 text-yellow-300"/> Quest Target</li>
        </ul>
    </div>
);


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const equipmentStats = useMemo(() => {
    if (!gameState.player) return { strength: 0, dexterity: 0, intelligence: 0, defense: 0 };
    return getEquipmentStats(gameState.player.equipment);
  }, [gameState.player?.equipment]);

  const totalStats = useMemo(() => {
    if (!gameState.player) return null;
    return {
      strength: gameState.player.stats.strength + equipmentStats.strength,
      dexterity: gameState.player.stats.dexterity + equipmentStats.dexterity,
      intelligence: gameState.player.stats.intelligence + equipmentStats.intelligence,
      defense: equipmentStats.defense,
    }
  }, [gameState.player?.stats, equipmentStats]);

  const addToLog = useCallback((message: string, worldOnly: boolean = false) => {
    setGameState(prev => {
        if (!worldOnly && prev.combatState) {
            const newCombatLog = [...prev.combatState.combatLog, message].slice(-100);
            return { ...prev, combatState: { ...prev.combatState, combatLog: newCombatLog } };
        } else {
            const newLog = [...(prev.log ?? []), message].slice(-100);
            return { ...prev, log: newLog };
        }
    });
  }, []);

  const setModal = useCallback((content: React.ReactNode | null) => {
    setGameState(prev => ({ ...prev, modalContent: content }));
  }, []);

  const findStartPosition = (map: MapCell[][]): { x: number; y: number } => {
    for (let y = 1; y < MAP_HEIGHT - 1; y++) {
      for (let x = 1; x < MAP_WIDTH - 1; x++) {
        if (map[y][x].type === 'floor') {
          return { x, y };
        }
      }
    }
    return { x: 1, y: 1 }; // Fallback
  };

  const startNewQuest = useCallback(async () => {
    if (!gameState.player || !gameState.world) return;
    setGameState(prev => ({ ...prev, isLoading: true }));
    addToLog("A new challenge awaits...", true);
    try {
        const remainingMonsters = gameState.world.monsters.filter(m =>
            gameState.world!.map.flat().some(cell => cell.entityId === m.id && cell.type === 'monster')
        );
        const newQuest = await geminiService.generateNewQuest(gameState.player.level, remainingMonsters);
        
        setGameState(prev => {
            if (!prev.world) return prev;
            const newMap = prev.world.map.map(row => row.map(cell => ({ ...cell, isQuestTarget: cell.entityId === newQuest.targetId || (newQuest.targetId === 'exit' && cell.type === 'exit') })));
            
            return {
                ...prev,
                world: { ...prev.world, quest: { ...newQuest, isCompleted: false }, map: newMap },
                isLoading: false,
            };
        });

        setModal(
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">New Quest: {newQuest.title}</h2>
                <p className="mb-2">{newQuest.description}</p>
                <p className="italic">Objective: {newQuest.objective}</p>
                <p className="mt-4 font-bold">Reward: {newQuest.xpReward} XP</p>
            </div>
        );

    } catch (error) {
        console.error("Failed to generate new quest:", error);
        addToLog("The echoes of destiny are silent. No new quest could be found.", true);
        setGameState(prev => ({ ...prev, isLoading: false }));
    }
  }, [gameState.player, gameState.world, addToLog, setModal]);

  const generateNewDungeon = useCallback(async (level: number) => {
    setGameState(prev => ({...prev, isLoading: true}));
    addToLog(`Descending to dungeon level ${level}...`, true);
    try {
        const areaData = await geminiService.generateDungeon(level);
        
        const newWorld: World = {
            dungeonLevel: level,
            description: areaData.description,
            backgroundImageUrl: areaData.backgroundImageUrl,
            map: areaData.map,
            monsters: areaData.monsters,
            vendors: areaData.vendors,
            quest: areaData.quest,
        };

        const playerStartPos = findStartPosition(newWorld.map);
        
        setGameState(prev => ({
            ...prev,
            world: newWorld,
            player: prev.player ? {...prev.player, position: playerStartPos} : null,
            isLoading: false
        }));

        addToLog(`You've entered: ${areaData.name}. ${areaData.description}`, true);
        
        setModal(
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">New Quest: {areaData.quest.title}</h2>
                <p className="mb-2">{areaData.quest.description}</p>
                <p className="italic">Objective: {areaData.quest.objective}</p>
                <p className="mt-4 font-bold">Reward: {areaData.quest.xpReward} XP</p>
            </div>
        );

    } catch(error) {
        console.error("Failed to generate new dungeon:", error);
        addToLog("Error: The ancient magic binding this dungeon is unstable. Please try again.", true);
        setGameState(prev => ({...prev, isLoading: false}));
    }
  }, [addToLog, setModal]);
  
  const initiateCombat = useCallback(async (monster: Monster) => {
    addToLog(`You encounter a ${monster.name}!`, true);

    if (!monster.imageUrl && monster.imageGenPrompt) {
        setGameState(prev => ({ ...prev, isLoading: true }));
        
        const imageUrl = await geminiService.generateImageFromPrompt(monster.imageGenPrompt);
        const monsterForCombat = { ...monster, imageUrl };

        setGameState(prev => {
            if (!prev.world) return { ...prev, isLoading: false };
            const newMonsters = prev.world.monsters.map(m => m.id === monster.id ? monsterForCombat : m);
            return {
                ...prev,
                world: { ...prev.world, monsters: newMonsters },
                isLoading: false,
                combatState: {
                    monster: monsterForCombat,
                    playerTurn: true,
                    combatLog: [`You are challenged by a level ${monsterForCombat.level} ${monsterForCombat.name}!`],
                }
            };
        });
    } else {
        setGameState(prev => ({
            ...prev, 
            combatState: {
                monster: monster,
                playerTurn: true,
                combatLog: [`You are challenged by a level ${monster.level} ${monster.name}!`],
            }
        }));
    }
  }, [addToLog]);

  const openChest = useCallback(async (x: number, y: number) => {
    if (!gameState.player || !gameState.world) return;
    setGameState(prev => ({...prev, isLoading: true}));
    addToLog("You found a treasure chest!", true);
    try {
      const lootItems = await geminiService.generateLoot(gameState.player.level);
      
      if (lootItems && lootItems.length > 0) {
        addToLog(`You open it and find:`, true);
        lootItems.forEach(loot => {
            addToLog(`- ${loot.name}`, true);
        });
      } else {
        addToLog("The chest is empty.", true);
      }
      
      const newMap = gameState.world.map.map((row, my) => row.map((cell, mx) => {
            if (mx === x && my === y) return { ...cell, type: 'floor' as 'floor', entityId: undefined };
            return cell;
      }));
      
      setGameState(prev => ({
        ...prev,
        player: {...prev.player!, inventory: [...prev.player!.inventory, ...lootItems]},
        world: {...prev.world!, map: newMap},
        isLoading: false
      }));
    } catch(error) {
        console.error("Failed to generate loot:", error);
        addToLog("The chest is magically sealed and you cannot open it.", true);
        setGameState(prev => ({...prev, isLoading: false}));
    }
  }, [addToLog, gameState.player, gameState.world]);

  const handleTrapTrigger = useCallback(async (x: number, y: number) => {
     if (!gameState.player || !gameState.world) return;
     setGameState(prev => ({...prev, isLoading: true}));
     try {
        const trapResult = await geminiService.triggerTrap(gameState.player);
        addToLog(`TRAP! ${trapResult.narration}`, true);
        addToLog(`You take ${trapResult.damage} damage.`, true);
        
        const newPlayerHp = Math.max(0, gameState.player.hp - trapResult.damage);
        const newMap = gameState.world.map.map((row, my) => row.map((cell, mx) => {
            if (mx === x && my === y) return { ...cell, type: 'trap' as 'trap', isExplored: true, entityId: 'triggered' };
            return cell;
        }));

        const newPlayerState = {...gameState.player, hp: newPlayerHp};
        setGameState(prev => ({
            ...prev,
            player: newPlayerState,
            world: {...prev.world!, map: newMap},
            isLoading: false,
        }));
        
        if (newPlayerHp <= 0) {
            finalPlayerDeath(newPlayerState);
        }

     } catch(error) {
        console.error("Failed to trigger trap:", error);
        addToLog("You deftly avoid a hidden trap.", true);
        setGameState(prev => ({...prev, isLoading: false}));
     }
  }, [addToLog, gameState.player, gameState.world]);

  const handleBuyItem = useCallback((item: Item, vendorId: string) => {
    setGameState(prev => {
        if (!prev.player || !prev.world || !item.buyPrice || prev.player.gold < item.buyPrice) {
            addToLog("You cannot afford that.", true);
            return prev;
        }

        const newPlayer = {
            ...prev.player,
            gold: prev.player.gold - item.buyPrice,
            inventory: [...prev.player.inventory, item]
        };

        const newVendors = prev.world.vendors.map(v => {
            if (v.id === vendorId) {
                return {
                    ...v,
                    inventory: v.inventory.filter(i => i.id !== item.id)
                };
            }
            return v;
        });

        const newWorld = { ...prev.world, vendors: newVendors };

        addToLog(`You purchased ${item.name} for ${item.buyPrice} gold.`, true);

        return { ...prev, player: newPlayer, world: newWorld };
    });
  }, [addToLog]);

  const handleSellItem = useCallback((item: Item, vendorId: string) => {
    setGameState(prev => {
        if (!prev.player || !item.sellPrice || !prev.world) {
            addToLog("You cannot sell this item.", true);
            return prev;
        }

        const newPlayer = {
            ...prev.player,
            gold: prev.player.gold + item.sellPrice,
            inventory: prev.player.inventory.filter(i => i.id !== item.id)
        };
        
        const newVendors = prev.world.vendors.map(v => {
            if (v.id === vendorId) {
                // Add sorted item to vendor inventory
                const newVendorInventory = [...v.inventory, item].sort((a,b) => (a.buyPrice || 0) - (b.buyPrice || 0));
                return { ...v, inventory: newVendorInventory };
            }
            return v;
        });
        
        const newWorld = { ...prev.world, vendors: newVendors };

        addToLog(`You sold ${item.name} for ${item.sellPrice} gold.`, true);
        return { ...prev, player: newPlayer, world: newWorld };
    });
  }, [addToLog]);

  const handleInteraction = useCallback((cell: MapCell, x: number, y: number) => {
    if (!gameState.world || !gameState.player) return;
    switch(cell.type) {
        case 'monster':
            const monster = gameState.world.monsters.find(m => m.id === cell.entityId);
            if(monster) {
                initiateCombat(monster);
            }
            break;
        case 'chest':
            openChest(x, y);
            break;
        case 'exit':
            generateNewDungeon(gameState.world.dungeonLevel + 1);
            break;
        case 'vendor':
            const vendor = gameState.world.vendors.find(v => v.id === cell.entityId);
            if (vendor) {
                 setModal(
                    <VendorScreen
                        player={gameState.player}
                        vendor={vendor}
                        onBuy={handleBuyItem}
                        onSell={(item: Item) => handleSellItem(item, vendor.id)}
                    />
                 )
            }
            break;
    }
  }, [gameState.world, gameState.player, generateNewDungeon, initiateCombat, openChest, setModal, handleBuyItem, handleSellItem]);

  const handlePlayerMove = useCallback(async (dx: number, dy: number) => {
    if (gameState.isLoading || gameState.modalContent || gameState.combatState || !gameState.player || !gameState.world || gameState.isPaused) return;

    const { x, y } = gameState.player.position;
    const newX = x + dx;
    const newY = y + dy;

    if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) return;
    
    const targetCell = gameState.world.map[newY][newX];
    if (targetCell.type === 'wall') {
        addToLog("A solid wall blocks your path.", true);
        return;
    }

    if (targetCell.type === 'trap' && targetCell.entityId !== 'triggered') {
        await handleTrapTrigger(newX, newY);
        // after trap, player state has changed, so we return to avoid extra move
        return;
    }
    
    const newPlayerState = { ...gameState.player, position: { x: newX, y: newY } };
    
    setGameState(prev => ({ ...prev, player: newPlayerState }));
    handleInteraction(targetCell, newX, newY);
  }, [gameState, addToLog, handleInteraction, handleTrapTrigger]);

    const handleSelectAbility = useCallback((ability: Ability) => {
      setGameState(prev => {
        if (!prev.player || prev.player.pendingLevelUps <= 0) return prev;

        const newPlayer = {
          ...prev.player,
          abilities: [...prev.player.abilities, ability],
          stats: {
             ...prev.player.stats,
            strength: prev.player.stats.strength + 1,
            dexterity: prev.player.stats.dexterity + 1,
            intelligence: prev.player.stats.intelligence + 1
          },
          pendingLevelUps: prev.player.pendingLevelUps - 1,
        };

        const currentEquipmentStats = getEquipmentStats(newPlayer.equipment);
        const newMaxHp = 20 + newPlayer.stats.strength + currentEquipmentStats.strength;
        const hpDiff = newMaxHp - prev.player.maxHp;
        newPlayer.maxHp = newMaxHp;
        newPlayer.hp = Math.min(newMaxHp, prev.player.hp + hpDiff + 10);

        const newMaxMana = 10 + newPlayer.stats.intelligence + currentEquipmentStats.intelligence;
        const manaDiff = newMaxMana - prev.player.maxMana;
        newPlayer.maxMana = newMaxMana;
        newPlayer.mana = Math.min(newMaxMana, prev.player.mana + manaDiff);

        if (newPlayer.pendingLevelUps > 0) {
            // Defer opening next modal to useEffect to prevent nested state updates
        } else {
            setModal(null);
        }

        return { ...prev, player: newPlayer };
      });
      addToLog(`You learned a new ability: ${ability.name}! Your stats have increased.`, true);
  }, [addToLog, setModal]);

    const openLevelUpModal = useCallback(async (playerForModal: Player) => {
        setGameState(prev => ({ ...prev, isLoading: true }));
        try {
            const abilities = await geminiService.generateLevelUpAbilities(playerForModal);
            setGameState(prev => ({ ...prev, isLoading: false }));
            setModal(
                <div>
                    <h2 className="text-3xl font-bold text-green-400 mb-4">LEVEL UP! (Level {playerForModal.level})</h2>
                    <p>Your power grows! Choose a new ability to master.</p>
                    <p className="text-sm text-slate-400 mb-4">Your base stats, health, and mana have also increased.</p>
                    <div className="flex flex-col gap-2 mt-4">
                        {abilities.map(ability => (
                            <button key={ability.id} onClick={() => handleSelectAbility(ability)} className="text-left p-3 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-cyan-400">{ability.name}</p>
                                    <p className="text-sm text-blue-400">{ability.manaCost} Mana</p>
                                </div>
                                <p className="text-sm text-slate-300">{ability.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            );
        } catch (error) {
            console.error("Failed to generate abilities:", error);
            setGameState(prev => ({ ...prev, isLoading: false }));
            addToLog("The winds of knowledge are chaotic. You are unable to learn a new skill, but your stats have increased.", true)
            handleSelectAbility({ id: 'stat_increase', name: 'Stat Increase', description: 'Your core attributes have grown.', manaCost: 0 });
        }
  }, [setModal, addToLog, handleSelectAbility]);

  const checkLevelUp = useCallback(async (player: Player) => {
    let leveledUpPlayer = { ...player };
    let levelsGained = 0;

    while (leveledUpPlayer.xp >= leveledUpPlayer.xpToNextLevel) {
        leveledUpPlayer.xp -= leveledUpPlayer.xpToNextLevel;
        leveledUpPlayer.level += 1;
        leveledUpPlayer.xpToNextLevel = Math.floor(40 * Math.pow(1.5, leveledUpPlayer.level - 1));
        levelsGained++;
        addToLog(`Congratulations! You've reached level ${leveledUpPlayer.level}!`, true);
    }
    
    if (levelsGained > 0) {
        const playerWithFlag = {...leveledUpPlayer, pendingLevelUps: leveledUpPlayer.pendingLevelUps + levelsGained};
        setGameState(prev => ({...prev, player: playerWithFlag}));
    } else {
        setGameState(prev => ({...prev, player}));
    }
  }, [addToLog]);

  useEffect(() => {
      if (gameState.player && gameState.player.pendingLevelUps > 0 && !gameState.modalContent && !gameState.isLoading) {
          openLevelUpModal(gameState.player);
      }
  }, [gameState.player, gameState.modalContent, gameState.isLoading, openLevelUpModal]);
  
  const finalPlayerDeath = (player: Player) => {
      setModal(
          <div>
              <h2 className="text-3xl font-bold text-red-500 mb-4">YOU DIED</h2>
              <p>Your journey ends here. Reload a save from the main menu to try again.</p>
          </div>
      );
      setGameState(prev => ({...prev, player: {...player, hp: 0}, combatState: null}));
  }

  const handleCombatAction = async (action: CombatAction) => {
    if (!gameState.combatState || !gameState.combatState.playerTurn || !gameState.player || !gameState.world || !totalStats) return;
    
    if (action.type === 'ability') {
        if (gameState.player.mana < action.ability.manaCost) {
            addToLog("Not enough mana!", false);
            return;
        }
    }

    const originalPlayer = gameState.player;
    const originalCombatState = gameState.combatState;

    let playerForAction = { ...originalPlayer, stats: totalStats };
    
    setGameState(prev => ({...prev, combatState: {...prev.combatState!, playerTurn: false}}));

    try {
        const result = await geminiService.generateCombatAction(playerForAction, originalCombatState.monster, action, equipmentStats.defense);
        
        let finalPlayerState = { ...originalPlayer };
        let narration = result.narration;

        if (action.type === 'item') {
            const potion = action.item;
            let effects = [];
            if(potion.healAmount){
                const newHp = Math.min(finalPlayerState.maxHp, finalPlayerState.hp + potion.healAmount);
                const healedFor = newHp - finalPlayerState.hp;
                effects.push(`restored ${healedFor} health`);
                finalPlayerState.hp = newHp;
            }
            if(potion.manaAmount){
                 const newMana = Math.min(finalPlayerState.maxMana, finalPlayerState.mana + potion.manaAmount);
                 const restoredFor = newMana - finalPlayerState.mana;
                 effects.push(`restored ${restoredFor} mana`);
                 finalPlayerState.mana = newMana;
            }

            addToLog(`You use ${potion.name} and ${effects.join(' and ')}.`, false);

            const potionIndex = finalPlayerState.inventory.findIndex(i => i.id === potion.id);
            if(potionIndex > -1) {
                const newInventory = [...finalPlayerState.inventory];
                newInventory.splice(potionIndex, 1);
                finalPlayerState.inventory = newInventory;
            }
        }
        
        if (action.type === 'ability') {
            finalPlayerState.mana = Math.max(0, finalPlayerState.mana - action.ability.manaCost);
        }

        addToLog(narration, false);

        finalPlayerState.hp = Math.max(0, finalPlayerState.hp - result.playerDamage);
        const newMonsterHp = Math.max(0, originalCombatState.monster.hp - result.monsterDamage);

        if (result.monsterDefeated || newMonsterHp <= 0) {
            finalPlayerState.xp += result.xpGained;
            finalPlayerState.gold += result.goldGained;
            addToLog(`You defeated the ${originalCombatState.monster.name} and gained ${result.xpGained} XP and ${result.goldGained} Gold!`, true);

            if (result.loot) {
                addToLog(`You found: ${result.loot.name}!`, true);
                finalPlayerState.inventory = [...finalPlayerState.inventory, result.loot];
            }
            
            const defeatedMonsterId = originalCombatState.monster.id;
            const quest = gameState.world.quest;
            let questCompleted = false;

            if (quest && !quest.isCompleted && quest.targetId === defeatedMonsterId) {
                questCompleted = true;
                addToLog(`Quest Complete: ${quest.title}! You earned ${quest.xpReward} XP.`, true);
                finalPlayerState.xp += quest.xpReward;
            }

            const newMap = gameState.world.map.map(row => row.map(cell => {
                if (cell.entityId === defeatedMonsterId) {
                    return { ...cell, type: 'floor' as 'floor', entityId: undefined, isQuestTarget: false };
                }
                return cell;
            }));

            setGameState(prev => ({
                ...prev,
                player: finalPlayerState,
                world: { ...prev.world!, map: newMap, quest: questCompleted ? {...prev.world!.quest!, isCompleted: true} : prev.world!.quest },
                combatState: null,
            }));

            await checkLevelUp(finalPlayerState);
            if(questCompleted) {
                await startNewQuest();
            }

        } else if (finalPlayerState.hp <= 0) {
            setGameState(prev => ({...prev, player: finalPlayerState, combatState: null}));
            finalPlayerDeath(finalPlayerState);
        } else {
             setGameState(prev => ({
                ...prev,
                player: finalPlayerState,
                combatState: {
                    ...prev.combatState!,
                    monster: {...prev.combatState!.monster, hp: newMonsterHp},
                    playerTurn: true 
                }
            }));
        }

    } catch (error) {
        console.error("Combat action failed:", error);
        addToLog("A strange force disrupts the battle.", false);
        setGameState(prev => ({...prev, combatState: prev.combatState ? {...prev.combatState, playerTurn: true} : null}));
    }
  };
  
  const handleSaveGame = () => {
    fileUtils.saveGame(gameState);
    addToLog("Game saved.", true);
  };

  const handleLoadGame = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const state = await fileUtils.loadGame(event);
      if (state) {
        // Migration for older saves
        if (!state.combatState) state.combatState = null;
        if (state.player) {
            if (!state.player.abilities) state.player.abilities = [];
            if (!state.player.equipment) state.player.equipment = { weapon: null, armor: null, helmet: null, boots: null, ring: null };
            if (state.player.pendingLevelUps === undefined) {
                state.player.pendingLevelUps = (state.player as any).hasPendingLevelUp ? 1 : 0;
            }
            if (state.player.mana === undefined) {
                const equipment = getEquipmentStats(state.player.equipment);
                const maxMana = 10 + state.player.stats.intelligence + equipment.intelligence;
                state.player.mana = maxMana;
                state.player.maxMana = maxMana;
            }
            if (state.player.gold === undefined) state.player.gold = 0;
        }
        if (state.world && !state.world.vendors) state.world.vendors = [];
        
        state.gamePhase = 'playing';
        state.isPaused = false;
        setGameState(state);
        addToLog("Game loaded successfully.", true);
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      addToLog("Error: The save file is corrupted or invalid.", true);
    }
  };

  const handleCharacterCreated = (player: Player) => {
    setGameState(prev => ({
      ...prev,
      player,
      gamePhase: 'playing',
      log: [`Welcome, ${player.name}! Your journey begins.`, player.backstory ?? 'You awaken in a strange place.'],
    }));
    generateNewDungeon(1);
  };

  const updatePlayerResourcesOnEquip = (player: Player, newEquipment: Player['equipment']) => {
    const oldEquipmentStats = getEquipmentStats(player.equipment);
    const newEquipmentStats = getEquipmentStats(newEquipment);

    const newMaxHp = 20 + player.stats.strength + newEquipmentStats.strength;
    const hpChange = newMaxHp - player.maxHp;
    
    const newMaxMana = 10 + player.stats.intelligence + newEquipmentStats.intelligence;
    const manaChange = newMaxMana - player.maxMana;

    player.maxHp = newMaxHp;
    player.hp = Math.min(newMaxHp, Math.max(1, player.hp + hpChange));
    player.maxMana = newMaxMana;
    player.mana = Math.min(newMaxMana, Math.max(0, player.mana + manaChange));
  };


  const handleEquipItem = useCallback((itemToEquip: Item) => {
    if (!gameState.player || !itemToEquip) return;

    const slot = itemToEquip.type as EquipmentSlot;
    if (!EQUIPMENT_SLOTS.includes(slot)) {
        addToLog(`You can't equip ${itemToEquip.name}.`, true);
        return;
    }

    setGameState(prev => {
        if (!prev.player) return prev;
        
        const inventoryIndex = prev.player.inventory.findIndex(i => i.id === itemToEquip.id);
        if (inventoryIndex === -1) return prev;

        const newInventory = [...prev.player.inventory];
        newInventory.splice(inventoryIndex, 1);
        
        const currentlyEquipped = prev.player.equipment[slot];
        if (currentlyEquipped) {
            newInventory.push(currentlyEquipped);
        }

        const newEquipment = { ...prev.player.equipment, [slot]: itemToEquip };
        const newPlayerState = { ...prev.player, inventory: newInventory, equipment: newEquipment };
        
        updatePlayerResourcesOnEquip(newPlayerState, newEquipment);
        
        return { ...prev, player: newPlayerState };
    });
    
    addToLog(`Equipped ${itemToEquip.name}.`, true);
  }, [gameState.player, addToLog]);

  const handleUnequipItem = useCallback((slot: EquipmentSlot) => {
    if (!gameState.player) return;

    setGameState(prev => {
        if (!prev.player) return prev;
        
        const itemToUnequip = prev.player.equipment[slot];
        if (!itemToUnequip) return prev;

        const newInventory = [...prev.player.inventory, itemToUnequip];
        const newEquipment = { ...prev.player.equipment, [slot]: null };
        const newPlayerState = { ...prev.player, inventory: newInventory, equipment: newEquipment };

        updatePlayerResourcesOnEquip(newPlayerState, newEquipment);

        return { ...prev, player: newPlayerState };
    });

    addToLog(`Unequipped ${gameState.player.equipment[slot]!.name}.`, true);
  }, [gameState.player, addToLog]);

  const handleUseItem = useCallback((item: Item) => {
    if (!gameState.player) return;
    
    if (item.type !== 'potion') return;

    if ((item.healAmount && gameState.player.hp >= gameState.player.maxHp) && (item.manaAmount && gameState.player.mana >= gameState.player.maxMana)) {
        addToLog("You are already at full health and mana.", true);
        return;
    }

    setGameState(prev => {
        if (!prev.player) return prev;

        const newPlayerState = { ...prev.player };
        let effects = [];

        if (item.healAmount) {
            const newHp = Math.min(newPlayerState.maxHp, newPlayerState.hp + item.healAmount);
            effects.push(`restored ${newHp - newPlayerState.hp} health`);
            newPlayerState.hp = newHp;
        }
        if (item.manaAmount) {
            const newMana = Math.min(newPlayerState.maxMana, newPlayerState.mana + item.manaAmount);
            effects.push(`restored ${newMana - newPlayerState.mana} mana`);
            newPlayerState.mana = newMana;
        }
        
        const newInventory = [...prev.player.inventory];
        const itemIndex = newInventory.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
            newInventory.splice(itemIndex, 1);
        }
        newPlayerState.inventory = newInventory;
        
        addToLog(`You use the ${item.name} and ${effects.join(' and ')}.`, true);
        return { ...prev, player: newPlayerState };
    });
  }, [gameState.player, addToLog]);
  
  const openInventoryModal = useCallback(() => {
    if (!gameState.player) return;
    setModal(
        <InventoryScreen
            player={gameState.player}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onUseItem={handleUseItem}
        />
    )
  }, [gameState.player, handleEquipItem, handleUnequipItem, handleUseItem, setModal]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
             if (gameState.modalContent) {
                 if (!(React.isValidElement(gameState.modalContent) && (gameState.modalContent.type === VendorScreen || gameState.modalContent.type === InventoryScreen))) {
                   setModal(null);
                 } else if (React.isValidElement(gameState.modalContent)) {
                    // these modals have their own close buttons in the wrapper
                 }
             } else if (gameState.gamePhase === 'playing' && !gameState.combatState) {
                setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
             }
        } else if (e.key.toLowerCase() === 'i' && gameState.gamePhase === 'playing' && !gameState.combatState && !gameState.modalContent && !gameState.isPaused) {
            openInventoryModal();
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState.gamePhase, gameState.modalContent, gameState.combatState, gameState.isPaused, setModal, openInventoryModal]);

  const handleContinue = () => setGameState(prev => ({...prev, isPaused: false}));
  const handleReturnToMenu = () => {
       setGameState(prev => ({
           ...prev,
           gamePhase: 'menu',
           isPaused: false,
       }));
  };
  
  const renderGame = () => {
    if (!gameState.player || !gameState.world || !totalStats) {
        return <div className="text-center w-full">Error: Player or World not initialized.</div>;
    }
      
    if (gameState.combatState) {
      return <CombatScreen player={gameState.player} combatState={gameState.combatState} onAction={handleCombatAction} />
    }

    return (
      <div className="flex h-screen w-screen bg-slate-900 text-slate-200 font-sans p-4 gap-4">
        <div className="flex-grow flex flex-col gap-4">
            <div className="flex-grow">
                 <GameScreen 
                    map={gameState.world.map} 
                    player={gameState.player} 
                    monsters={gameState.world.monsters}
                    backgroundImageUrl={gameState.world.backgroundImageUrl}
                    onPlayerMove={handlePlayerMove}
                />
            </div>
            <div className="flex-shrink-0 flex gap-4 h-52">
                <div className="flex-grow-[3] w-0">
                    <LogPanel log={gameState.log} quest={gameState.world.quest} />
                </div>
                <div className="flex-grow-[2] w-0">
                    <Legend />
                </div>
                <div className="flex-grow-[1] w-0">
                    <GameActions 
                        onSave={handleSaveGame} 
                        onPause={() => setGameState(prev => ({...prev, isPaused: true}))} 
                        onOpenInventory={openInventoryModal}
                    />
                </div>
            </div>
        </div>

        <div className="w-1/4 max-w-sm flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <CharacterSheet 
            player={gameState.player}
            equipmentStats={equipmentStats}
            totalStats={totalStats}
            onUnequipItem={handleUnequipItem}
            onLevelUpClick={() => openLevelUpModal(gameState.player!)}
          />
        </div>
      </div>
    );
  };

  return (
     <>
        {gameState.isLoading && (
             <div 
                className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center transition-opacity duration-300"
            >
                <LoadingIcon className="animate-spin h-16 w-16 text-cyan-400"/>
                <p className="mt-4 text-lg text-slate-100">The world is shifting...</p>
            </div>
        )}
        {gameState.modalContent && (
             <ActionModal onClose={() => setModal(null)}>
                {React.cloneElement(gameState.modalContent as React.ReactElement<any>, { onClose: () => setModal(null) })}
            </ActionModal>
        )}
         {gameState.isPaused && (
            <PauseModal
                onContinue={handleContinue}
                onSave={handleSaveGame}
                onReturnToMenu={handleReturnToMenu}
            />
        )}
        
        {gameState.gamePhase === 'menu' && <MenuScreen onNewGame={() => setGameState(prev => ({...prev, gamePhase: 'characterCreation'}))} onLoadGame={handleLoadGame} onContinue={() => setGameState(prev => ({...prev, gamePhase: 'playing'}))} canContinue={!!gameState.player} />}
        {gameState.gamePhase === 'characterCreation' && <CharacterCreationScreen onStartGame={handleCharacterCreated} />}
        {gameState.gamePhase === 'playing' && renderGame()}
     </>
  );
};

export default App;
