import { GoogleGenAI, Type } from "@google/genai";
import { Player, Monster, Item, QuestObjective, Ability, MapCell, CombatAction, Vendor } from '../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const generateImageFromPrompt = async (prompt: string, aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16' = '1:1'): Promise<string> => {
    const getPlaceholderDimensions = (aspectRatio: string) => {
        switch (aspectRatio) {
            case '16:9': return '1024x576';
            case '9:16': return '576x1024';
            case '4:3': return '1024x768';
            case '3:4': return '768x1024';
            case '1:1':
            default: return '512x512';
        }
    };
    const dimensions = getPlaceholderDimensions(aspectRatio);
    const placeholderUrl = `https://dummyimage.com/${dimensions}/1e293b/94a3b8.png&text=Image+Unavailable`;

    try {
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio },
        });
        if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
            console.error("Image generation failed to return an image for prompt:", prompt);
            return placeholderUrl;
        }
        return `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
    } catch (error) {
        console.error("Image generation API call failed for prompt:", prompt, error);
        return placeholderUrl;
    }
}

const characterSchema = {
    type: Type.OBJECT,
    properties: {
        backstory: { type: Type.STRING, description: "A short, two-sentence backstory for the character." },
        stats: {
            type: Type.OBJECT,
            properties: {
                strength: { type: Type.INTEGER },
                dexterity: { type: Type.INTEGER },
                intelligence: { type: Type.INTEGER },
            },
            required: ["strength", "dexterity", "intelligence"]
        },
        imageGenPrompt: { type: Type.STRING, description: "A detailed prompt for a character portrait. Style: 'fantasy character portrait, digital painting, full body shot'."}
    },
    required: ["backstory", "stats", "imageGenPrompt"]
};

export const generateCharacter = async (name: string, characterClass: 'Warrior' | 'Mage' | 'Rogue'): Promise<Partial<Player>> => {
    const prompt = `Generate a starting character for a fantasy RPG.
    Name: ${name}
    Class: ${characterClass}
    
    Based on the class, generate a short backstory, balanced starting stats (totaling 30 points, with a focus on the class's primary attribute: Strength for Warrior, Intelligence for Mage, Dexterity for Rogue), and a detailed image generation prompt for a full-body portrait.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: characterSchema,
        },
    });

    const characterData = JSON.parse(response.text);
    const imageUrl = await generateImageFromPrompt(characterData.imageGenPrompt, '1:1');

    return {
        ...characterData,
        imageUrl,
    };
};

const itemStatsSchema = {
    type: Type.OBJECT,
    description: "Stat bonuses provided by the item. Can be null for non-equipment.",
    properties: {
        strength: { type: Type.INTEGER },
        dexterity: { type: Type.INTEGER },
        intelligence: { type: Type.INTEGER },
        defense: { type: Type.INTEGER }
    }
};

const itemSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Unique ID, e.g., 'item_123'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING, description: "Flavorful description of the item." },
        type: { type: Type.STRING, enum: ['weapon', 'armor', 'helmet', 'boots', 'ring', 'potion', 'misc'] },
        stats: itemStatsSchema,
        healAmount: { type: Type.INTEGER, description: "The amount of health this item restores if it is a potion. Omit or set to null otherwise." },
        manaAmount: { type: Type.INTEGER, description: "The amount of mana this item restores if it is a potion. Omit or set to null otherwise." },
        buyPrice: { type: Type.INTEGER, description: "Price to buy this item from a vendor." },
        sellPrice: { type: Type.INTEGER, description: "Price when selling this item to a vendor. Should be about half of the buy price." },
    },
    required: ["id", "name", "description", "type"]
};

const dungeonSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A cool, fantasy name for this dungeon level, like 'The Sunken Crypt' or 'Cave of Whispers'." },
        description: { type: Type.STRING, description: "A one-sentence atmospheric description of the dungeon level." },
        imageGenPrompt: { type: Type.STRING, description: "A concise prompt for a top-down background image. Style: 'top-down view, fantasy RPG map, digital painting'. Describe terrain (e.g., 'flooded stone floors, ancient ruins')."},
        quest: {
            type: Type.OBJECT,
            properties: {
                 id: { type: Type.STRING, description: "A unique ID for the quest, e.g., 'quest_001'."},
                 title: { type: Type.STRING },
                 description: { type: Type.STRING, description: "A flavorful, one-paragraph description of the quest." },
                 objective: { type: Type.STRING, description: "A short, clear objective, e.g., 'Slay the Troll Chieftain'." },
                 xpReward: { type: Type.INTEGER }
            },
            required: ["id", "title", "description", "objective", "xpReward"]
        },
        entities: {
            type: Type.ARRAY,
            description: "A list of monsters and a quest boss for this level. The last monster in the list is the quest target.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique ID for the entity, e.g., 'goblin_1'." },
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER },
                    isQuestTarget: { type: Type.BOOLEAN, description: "True if this is the target of the quest." },
                    imageGenPrompt: { type: Type.STRING, description: "A detailed prompt for a character portrait of this monster. Style: 'fantasy character portrait, digital painting'. Describe the monster's appearance."}
                },
                required: ["id", "name", "level", "isQuestTarget", "imageGenPrompt"]
            }
        },
        vendor: {
            type: Type.OBJECT,
            description: "A single vendor for this dungeon level.",
            properties: {
                id: { type: Type.STRING, description: "Unique ID for the vendor, e.g., 'vendor_grizelda'." },
                inventory: {
                    type: Type.ARRAY,
                    description: "List of 4-6 items the vendor sells. Include potions and equipment relevant to the player's level.",
                    items: itemSchema,
                }
            },
            required: ["id", "inventory"]
        }
    },
    required: ["name", "description", "imageGenPrompt", "quest", "entities", "vendor"]
};

export const generateDungeon = async (level: number) => {
    const prompt = `Generate a new, unique dungeon level for a fantasy RPG for a level ${level} player. The dungeon needs a distinct theme (e.g., fiery, icy, crypts).
    The theme should be cohesive.
    Create a quest for this level. The quest objective must be to kill a unique boss monster.
    Generate ${Math.min(4, level + 1)} regular monsters and 1 boss monster appropriate for this level and theme. The boss monster should be the last in the 'entities' list and marked as the quest target. Provide an image generation prompt for each monster.
    Also generate one vendor with an inventory of 5 thematically appropriate items (potions, equipment) for a player of this level. Ensure items have buy and sell prices, with sell being about half of buy.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: dungeonSchema,
            temperature: 0.9,
        },
    });

    const dungeonData = JSON.parse(response.text);

    const backgroundImageUrl = await generateImageFromPrompt(dungeonData.imageGenPrompt, '1:1');

    const monsters: Monster[] = dungeonData.entities.map((entity: any) => {
        const hp = entity.level * 10 + (entity.isQuestTarget ? 20 : 0);
        return {
            ...entity,
            hp,
            maxHp: hp,
        };
    });
    
    const vendors: Vendor[] = [dungeonData.vendor];

    const questBoss = monsters[monsters.length - 1];
    const quest: QuestObjective = {
        ...dungeonData.quest,
        isCompleted: false,
        targetId: questBoss!.id,
    };
    
    // Procedural map generation
    const map: MapCell[][] = Array(MAP_HEIGHT).fill(null).map(() => Array(MAP_WIDTH).fill({ type: 'wall', isExplored: true }));
    const rooms: {x:number,y:number,w:number,h:number}[] = [];
    const numRooms = 5 + Math.floor(Math.random() * 3);
    for(let i = 0; i < numRooms; i++) {
        const w = 4 + Math.floor(Math.random() * 4);
        const h = 4 + Math.floor(Math.random() * 4);
        const x = 1 + Math.floor(Math.random() * (MAP_WIDTH - w - 2));
        const y = 1 + Math.floor(Math.random() * (MAP_HEIGHT - h - 2));
        
        for(let ry = y; ry < y + h; ry++) {
            for(let rx = x; rx < x + w; rx++) {
                map[ry][rx] = { type: 'floor', isExplored: true };
            }
        }
        if (rooms.length > 0) {
            let prev = rooms[rooms.length-1];
            let prevCenterX = prev.x + Math.floor(prev.w/2);
            let prevCenterY = prev.y + Math.floor(prev.h/2);
            let currCenterX = x + Math.floor(w/2);
            let currCenterY = y + Math.floor(h/2);

            for (let hx = Math.min(prevCenterX, currCenterX); hx <= Math.max(prevCenterX, currCenterX); hx++) map[prevCenterY][hx] = { type: 'floor', isExplored: true };
            for (let vy = Math.min(prevCenterY, currCenterY); vy <= Math.max(prevCenterY, currCenterY); vy++) map[vy][currCenterX] = { type: 'floor', isExplored: true };
        }
        rooms.push({x, y, w, h});
    }

    const placeEntity = (type: MapCell['type'], entityId?: string, isQuestTarget?: boolean) => {
        let placed = false;
        while(!placed) {
            const x = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
            const y = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
            if(map[y][x].type === 'floor' && map[y][x].entityId === undefined) {
                map[y][x] = { type, isExplored: true, entityId, isQuestTarget };
                placed = true;
            }
        }
    }
    
    monsters.forEach((m) => {
        const isQuestTarget = quest.targetId === m.id;
        placeEntity('monster', m.id, isQuestTarget)
    });
    vendors.forEach((v) => {
        placeEntity('vendor', v.id);
    });
    for(let i=0; i<3; i++) placeEntity('chest');
    for(let i=0; i<3; i++) placeEntity('trap');
    placeEntity('exit');

    return { name: dungeonData.name, description: dungeonData.description, backgroundImageUrl, map, monsters, vendors, quest };
};


const combatActionSchema = {
    type: Type.OBJECT,
    properties: {
        narration: { type: Type.STRING, description: "A dramatic, single-turn narration of the action. Describe the player's move, its effect, and the monster's counter-attack."},
        playerDamage: { type: Type.INTEGER, description: "Damage dealt TO the player this turn from the monster's counter-attack."},
        monsterDamage: { type: Type.INTEGER, description: "Damage dealt TO the monster this turn from the player's action."},
        monsterDefeated: { type: Type.BOOLEAN, description: "True if the monster's HP should be 0 or less after this turn."},
        xpGained: { type: Type.INTEGER, description: "XP awarded if monster is defeated. 0 otherwise."},
        goldGained: { type: Type.INTEGER, description: "Gold awarded if monster is defeated. 0 otherwise."},
        loot: {
            ...itemSchema,
            description: "A single item dropped by the monster, if defeated. 25% chance of dropping loot. Can be null.",
        }
    },
    required: ["narration", "playerDamage", "monsterDamage", "monsterDefeated", "xpGained", "goldGained"]
};

export const generateCombatAction = async (player: Player, monster: Monster, action: CombatAction, playerDefense: number) => {
    let actionText: string;
    switch (action.type) {
        case 'attack':
            actionText = 'The player attacks the monster with their weapon.';
            break;
        case 'ability':
            actionText = `The player uses the ability: ${action.ability.name} - ${action.ability.description} (Cost: ${action.ability.manaCost} mana).`;
            break;
        case 'item':
            const item = action.item;
            let effect = '';
            if (item.healAmount) effect += `restores ${item.healAmount} HP.`;
            if (item.manaAmount) effect += `restores ${item.manaAmount} Mana.`;
            actionText = `The player uses the item: ${item.name}. ${effect}`;
            break;
    }

    const prompt = `Narrate a single turn exchange in a fantasy RPG combat.
    Player: Level ${player.level}, HP ${player.hp}, Mana ${player.mana}, Stats (with equipment) ${JSON.stringify(player.stats)}, Defense ${playerDefense}, Abilities: ${player.abilities.map(a => a.name).join(', ')}
    Monster: ${monster.name}, Level ${monster.level}, HP ${monster.hp}

    Player's action this turn: ${actionText}

    Rules:
    - Player Strength influences physical damage. Player Intelligence influences ability effectiveness.
    - If the player uses a potion, they do not attack this turn, so 'monsterDamage' should be 0. The player still receives damage from the monster's counter-attack. The healing/mana restoration from the potion happens *before* the monster's counter-attack.
    - Monster's Level is its main power source.
    - Player's Defense reduces incoming damage. High defense should significantly lower playerDamage.
    - Calculate damage for both player and monster for this turn exchange.
    - If the monster is defeated by this action, set monsterDefeated to true.
    - If defeated, calculate XP (around 25 * monster level) and gold (around 10 * monster level).
    - If defeated, 30% chance of a loot drop. If loot is dropped, it must have stats if it's equippable and prices. If it is a potion, it must have a healAmount or manaAmount. Sell price should be half buy price.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: combatActionSchema,
            temperature: 0.7
        },
    });
    return JSON.parse(response.text);
};


const abilitiesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "Unique ID, e.g., 'ability_fireball'."},
            name: { type: Type.STRING },
            description: { type: Type.STRING, description: "Short description of what the ability does in turn-based combat." },
            manaCost: { type: Type.INTEGER, description: "The mana cost to use this ability. Should be balanced with its power."}
        },
        required: ["id", "name", "description", "manaCost"]
    }
}

export const generateLevelUpAbilities = async (player: Player): Promise<Ability[]> => {
    const prompt = `Generate exactly 3 thematic and unique combat abilities for a Level ${player.level} fantasy character to choose from upon leveling up. These are for a turn-based combat system.
    The character's base stats are: Strength ${player.stats.strength}, Dexterity ${player.stats.dexterity}, Intelligence ${player.stats.intelligence}. 
    The abilities should reflect these stats (e.g., high strength -> mighty blows, high intelligence -> powerful spells).
    Each ability must have a reasonable 'manaCost' associated with it, balanced for its power level.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: abilitiesSchema
        },
    });
    return JSON.parse(response.text);
}


const lootListSchema = {
    type: Type.ARRAY,
    items: itemSchema
};

export const generateLoot = async (playerLevel: number): Promise<Item[]> => {
    const prompt = `Generate a list of 1 to 3 interesting fantasy RPG loot items found in a chest, appropriate for a level ${playerLevel} character. 
    - Ensure all items have a buyPrice and a sellPrice. Sell price should be roughly half the buy price.
    - If an item is equippable (weapon, armor, helmet, boots, ring), give it stat bonuses.
    - If an item is a potion, give it a 'healAmount' or 'manaAmount' property with a value between 15 and 50. It can have one or both.
    - Stat bonuses should be appropriate for the player's level (e.g., +1 for low level, up to +5 for high level).
    - Weapons boost strength/dexterity. Armor/helmets/boots boost defense. Rings can boost any stat.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: lootListSchema
        },
    });

    const lootDataList = JSON.parse(response.text);
    return lootDataList;
};

const trapSchema = {
    type: Type.OBJECT,
    properties: {
        narration: { type: Type.STRING, description: "A short, flavorful narration of the player triggering the trap and its immediate effect."},
        damage: { type: Type.INTEGER, description: "The amount of damage the trap deals to the player."},
    },
    required: ["narration", "damage"]
};

export const triggerTrap = async (player: Player) => {
    const prompt = `A level ${player.level} player has stepped on a hidden trap in a fantasy dungeon. Describe the trap and its effect.
    Generate a narration for the event and calculate the damage dealt. Damage should be moderate, around 5-15% of the player's max HP (${player.maxHp}).
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: trapSchema,
        },
    });

    return JSON.parse(response.text);
};


const newQuestSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique ID for the quest, e.g., 'quest_002'." },
        title: { type: Type.STRING },
        description: { type: Type.STRING, description: "A flavorful, one-paragraph description of the quest." },
        objective: { type: Type.STRING, description: "A short, clear objective, e.g., 'Slay the Cave Spider' or 'Find the exit to the next level'." },
        xpReward: { type: Type.INTEGER },
        targetId: { type: Type.STRING, description: "The ID of the target monster. If the quest is to find the exit, this should be 'exit'." }
    },
    required: ["id", "title", "description", "objective", "xpReward", "targetId"]
};

export const generateNewQuest = async (playerLevel: number, remainingMonsters: Monster[]): Promise<QuestObjective> => {
    const monsterList = remainingMonsters.map(m => ({ id: m.id, name: m.name }));
    const prompt = `Generate a new side-quest for a level ${playerLevel} player in a fantasy dungeon.
    
    Available targets:
    ${monsterList.length > 0 ? `Monsters: ${JSON.stringify(monsterList)}` : 'No monsters remain.'}

    Rules:
    - If monsters are available, create a quest to defeat one of them. Pick one and set its 'id' as 'targetId'.
    - If no monsters remain, create a quest for the player to find the dungeon exit. Set 'targetId' to 'exit'.
    - The quest should be thematic for a dungeon environment.
    - Provide a suitable XP reward for the player's level.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: newQuestSchema
        },
    });

    return JSON.parse(response.text) as QuestObjective;
};
