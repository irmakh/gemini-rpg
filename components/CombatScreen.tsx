import React, { useRef, useEffect } from 'react';
import { Player, CombatState, Ability, CombatAction, Item } from '../types';
import { HealthIcon, LoadingIcon, MonsterIcon, ManaIcon } from './icons';

interface CombatScreenProps {
  player: Player;
  combatState: CombatState;
  onAction: (action: CombatAction) => void;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; }> = ({ value, maxValue, color }) => {
  const percentage = maxValue > 0 ? Math.max(0, Math.min(100, (value / maxValue) * 100)) : 0;
  return (
    <div className="w-full bg-slate-700 rounded-full h-4 border border-slate-600">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const CombatScreen: React.FC<CombatScreenProps> = ({ player, combatState, onAction }) => {
    const { monster, playerTurn, combatLog } = combatState;
    const [showAbilities, setShowAbilities] = React.useState(false);
    const [showItems, setShowItems] = React.useState(false);
    const combatLogEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        combatLogEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [combatLog]);

    const usablePotions = player.inventory.filter(item => item.type === 'potion' && (item.healAmount || item.manaAmount));

    const handleShowAbilities = () => {
        setShowItems(false);
        setShowAbilities(true);
    };

    const handleShowItems = () => {
        setShowAbilities(false);
        setShowItems(true);
    };
    
    const handleBackToMainActions = () => {
        setShowAbilities(false);
        setShowItems(false);
    };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-4xl h-full flex flex-col gap-4">
            
            <div className="flex-1 flex flex-col items-center justify-end">
                <div className="text-center w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-400">{monster.name}</h2>
                    <p className="text-lg text-slate-300">Level {monster.level}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <HealthIcon className="h-6 w-6 text-red-500" />
                        <StatBar value={monster.hp} maxValue={monster.maxHp} color="bg-red-600" />
                         <span className="text-sm font-mono">{monster.hp}/{monster.maxHp}</span>
                    </div>
                </div>
                {monster.imageUrl ? (
                    <img src={monster.imageUrl} alt={monster.name} className="h-48 w-48 md:h-64 md:w-64 object-contain rounded-lg mt-4" style={{filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))'}} />
                ) : (
                    <div className="h-48 w-48 md:h-64 md:w-64 bg-slate-800 rounded-lg mt-4 border-4 border-red-900/50 shadow-lg flex items-center justify-center">
                        <MonsterIcon className="h-32 w-32 text-red-500/80" />
                    </div>
                )}
            </div>

            <div className="h-40 bg-slate-800/50 border border-slate-700 rounded-lg p-3 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {combatLog.map((entry, index) => (
                        <p key={index} className={`text-sm ${index === combatLog.length - 1 ? 'text-white font-semibold' : 'text-slate-400'}`}>
                            &gt; {entry}
                        </p>
                    ))}
                    {!playerTurn && 
                        <p className="text-sm text-yellow-300 italic flex items-center gap-2"><LoadingIcon className="h-4 w-4 animate-spin" /> Waiting for action...</p>
                    }
                    <div ref={combatLogEndRef} />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start">
                 <div className="text-center w-full max-w-md">
                    <h2 className="text-3xl font-bold text-cyan-400">{player.name}</h2>
                     <div className="flex items-center gap-2 mt-2">
                        <HealthIcon className="h-6 w-6 text-green-500" />
                        <StatBar value={player.hp} maxValue={player.maxHp} color="bg-green-600" />
                        <span className="text-sm font-mono">{player.hp}/{player.maxHp}</span>
                    </div>
                     <div className="flex items-center gap-2 mt-2">
                        <ManaIcon className="h-6 w-6 text-blue-500" />
                        <StatBar value={player.mana} maxValue={player.maxMana} color="bg-blue-600" />
                        <span className="text-sm font-mono">{player.mana}/{player.maxMana}</span>
                    </div>
                </div>

                <div className="mt-4 flex gap-4 min-h-[60px] items-center">
                    {!showAbilities && !showItems ? (
                         <>
                            <button 
                                onClick={() => onAction({type: 'attack'})} 
                                disabled={!playerTurn} 
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xl transition-colors shadow-md">
                                Attack
                            </button>
                             <button 
                                onClick={handleShowAbilities}
                                disabled={!playerTurn || player.abilities.filter(a => a.id !== 'stat_increase').length === 0} 
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xl transition-colors shadow-md">
                                Abilities
                            </button>
                             <button 
                                onClick={handleShowItems}
                                disabled={!playerTurn || usablePotions.length === 0} 
                                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xl transition-colors shadow-md">
                                Items
                            </button>
                         </>
                    ) : showAbilities ? (
                        <div className="flex gap-2 items-center bg-slate-800 p-2 rounded-lg">
                             <button onClick={handleBackToMainActions} className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded h-full">Back</button>
                             <div className="flex gap-2 items-center">
                                {player.abilities.filter(a => a.id !== 'stat_increase').map(ability => {
                                    const canAfford = player.mana >= ability.manaCost;
                                    return (
                                     <button 
                                        key={ability.id}
                                        onClick={() => {
                                            if (canAfford) {
                                                onAction({type: 'ability', ability});
                                                handleBackToMainActions();
                                            }
                                        }}
                                        disabled={!playerTurn || !canAfford}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-bold rounded text-center"
                                        title={ability.description}
                                    >
                                        {ability.name}
                                        <span className={`block text-xs ${canAfford ? 'text-blue-300' : 'text-red-400'}`}>
                                            {ability.manaCost} Mana
                                        </span>
                                     </button>
                                 )})}
                             </div>
                        </div>
                    ) : ( // showItems must be true
                         <div className="flex gap-2 items-center bg-slate-800 p-2 rounded-lg">
                             <button onClick={handleBackToMainActions} className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded h-full">Back</button>
                             <div className="flex flex-wrap gap-2 items-center max-w-sm justify-center">
                                {usablePotions.map(potion => (
                                     <button 
                                        key={potion.id}
                                        onClick={() => {
                                            onAction({type: 'item', item: potion});
                                            handleBackToMainActions();
                                        }}
                                        disabled={!playerTurn}
                                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 text-white font-bold rounded"
                                        title={`${potion.healAmount ? `Heals ${potion.healAmount} HP` : ''}${potion.manaAmount ? ` Restores ${potion.manaAmount} Mana` : ''}`}
                                    >
                                        {potion.name}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
         <style>{`
          @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          .animate-fade-in {
              animation: fade-in 0.3s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default CombatScreen;
