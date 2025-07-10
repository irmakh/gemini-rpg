import React from 'react';

export type CharacterClass = 'Warrior' | 'Mage' | 'Rogue';
export type ItemGrade = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface Ability {
    id: string;
    name: string;
    description: string;
    manaCost: number;
}

export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'ring';
export const EQUIPMENT_SLOTS: EquipmentSlot[] = ['weapon', 'armor', 'helmet', 'boots', 'ring'];

export type ItemType = EquipmentSlot | 'potion' | 'misc' | 'gem';

export interface ItemStats {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  defense?: number;
}

export interface Item {
  id: string;
  name:string;
  description: string;
  type: ItemType;
  quantity: number;
  grade?: ItemGrade;
  stats?: ItemStats;
  healAmount?: number;
  manaAmount?: number;
  buyPrice?: number;
  sellPrice?: number;
}

export interface Player {
  name: string;
  characterClass: CharacterClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  position: { x: number; y: number };
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
  };
  inventory: Item[];
  abilities: Ability[];
  equipment: Record<EquipmentSlot, Item | null>;
  pendingLevelUps: number;
  imageUrl?: string;
  backstory?: string;
}

export interface QuestObjective {
  id: string;
  title: string;
  description: string;
  objective: string;
  xpReward: number;
  isCompleted: boolean;
  targetId: string; 
}

export interface MapCell {
    type: 'floor' | 'wall' | 'monster' | 'chest' | 'npc' | 'exit' | 'trap' | 'vendor';
    isExplored: boolean;
    entityId?: string;
    isQuestTarget?: boolean;
}

export interface Monster {
    id: string;
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    imageUrl?: string;
    imageGenPrompt?: string;
}

export interface Vendor {
    id: string;
    inventory: Item[];
}

export interface World {
  map: MapCell[][];
  dungeonLevel: number;
  backgroundImageUrl: string;
  description: string;
  monsters: Monster[];
  vendors: Vendor[];
  quest: QuestObjective | null;
}

export interface CombatState {
    monster: Monster;
    playerTurn: boolean;
    combatLog: string[];
}

export type CombatAction = { type: 'attack' } | { type: 'ability', ability: Ability } | { type: 'item', item: Item };

export type GamePhase = 'menu' | 'characterCreation' | 'playing' | 'settings';

export interface GameSettings {
  useImagen: boolean;
}

export interface GameState {
  gamePhase: GamePhase;
  player: Player | null;
  world: World | null;
  log: string[];
  isLoading: boolean;
  modalContent: React.ReactNode | null;
  combatState: CombatState | null;
  isPaused: boolean;
  settings: GameSettings;
}