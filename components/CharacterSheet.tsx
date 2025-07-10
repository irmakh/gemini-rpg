import React from 'react';
import { Player, ItemStats, EquipmentSlot, EQUIPMENT_SLOTS } from '../types';
import { HealthIcon, ManaIcon, XPIcon, LevelIcon, StrengthIcon, DexterityIcon, IntelligenceIcon, ArmorIcon } from './icons';

interface CharacterSheetProps {
  player: Player;
  equipmentStats: { strength: number; dexterity: number; intelligence: number; defense: number; };
  totalStats: { strength: number; dexterity: number; intelligence: number; defense: number; };
  onUnequipItem: (slot: EquipmentSlot) => void;
  onLevelUpClick: () => void;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; icon: React.ReactNode; label: string }> = ({ value, maxValue, color, icon, label }) => {
  const percentage = maxValue > 0 ? Math.max(0, Math.min(100, (value / maxValue) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-sm">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold">{label}</span>
          </div>
          <span>{value} / {maxValue}</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const AttributeDisplay: React.FC<{ icon: React.ReactNode; base: number; bonus: number; label: string; }> = ({ icon, base, bonus, label }) => (
    <div className="bg-slate-700 p-2 rounded">
        {icon}
        <p className="font-bold">{base + bonus}</p>
        <p className="text-xs text-slate-400">
            {bonus > 0 ? `${base} (+${bonus})` : `${base}`}
        </p>
    </div>
);

const CharacterSheet: React.FC<CharacterSheetProps> = ({ player, equipmentStats, totalStats, onUnequipItem, onLevelUpClick }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col">
       {player.pendingLevelUps > 0 && (
        <button 
          onClick={onLevelUpClick} 
          className="mb-4 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg animate-pulse"
        >
          LEVEL UP AVAILABLE! {player.pendingLevelUps > 1 ? `(x${player.pendingLevelUps})` : ''}
        </button>
      )}
      <div className="flex gap-4">
        {player.imageUrl && (
            <div className="w-1/3 flex-shrink-0">
            <img src={player.imageUrl} alt={player.name} className="w-full h-auto rounded-lg border-2 border-cyan-800" />
            </div>
        )}
        <div className="flex-grow">
            <h2 className="text-2xl font-bold text-cyan-400 truncate">{player.name}</h2>
            <div className="flex items-center gap-2 text-lg">
                <LevelIcon className="h-6 w-6 text-yellow-400"/>
                <span className="font-bold">Level {player.level}</span>
            </div>
            <div className="text-lg font-bold text-yellow-500 mt-1">
                {player.gold} Gold
            </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <StatBar value={player.hp} maxValue={player.maxHp} color="bg-red-600" icon={<HealthIcon className="h-5 w-5 text-red-500" />} label="HP"/>
        <StatBar value={player.mana} maxValue={player.maxMana} color="bg-blue-600" icon={<ManaIcon className="h-5 w-5 text-blue-500" />} label="Mana"/>
        <StatBar value={player.xp} maxValue={player.xpToNextLevel} color="bg-green-500" icon={<XPIcon className="h-5 w-5 text-green-500"/>} label="XP"/>
        
        <div className="pt-2 border-t border-slate-600">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">Attributes</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
                <AttributeDisplay icon={<StrengthIcon className="h-6 w-6 mx-auto mb-1 text-orange-400" />} base={player.stats.strength} bonus={equipmentStats.strength} label="STR" />
                <AttributeDisplay icon={<DexterityIcon className="h-6 w-6 mx-auto mb-1 text-lime-400" />} base={player.stats.dexterity} bonus={equipmentStats.dexterity} label="DEX" />
                <AttributeDisplay icon={<IntelligenceIcon className="h-6 w-6 mx-auto mb-1 text-indigo-400" />} base={player.stats.intelligence} bonus={equipmentStats.intelligence} label="INT" />
                <div className="bg-slate-700 p-2 rounded">
                    <ArmorIcon className="h-6 w-6 mx-auto mb-1 text-sky-400" />
                    <p className="font-bold">{totalStats.defense}</p>
                    <p className="text-xs text-slate-400">DEF</p>
                </div>
            </div>
        </div>
        
        <div className="pt-2 border-t border-slate-600">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">Equipment</h3>
            <div className="space-y-1">
                {EQUIPMENT_SLOTS.map(slot => {
                    const item = player.equipment[slot];
                    return (
                        <div key={slot} className="flex items-center justify-between bg-slate-700/80 px-2 py-1 rounded text-sm">
                            <span className="capitalize text-slate-400 font-semibold">{slot}</span>
                            {item ? (
                                <button onClick={() => onUnequipItem(slot)} className="text-right hover:text-red-400 transition-colors group" title={`Unequip ${item.name}`}>
                                    <p className="font-bold text-slate-100 group-hover:text-red-400">{item.name}</p>
                                </button>
                            ) : (
                                <span className="text-slate-500 italic">Empty</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>


        {player.abilities && player.abilities.length > 0 && (
           <div className="pt-2 border-t border-slate-600">
             <h3 className="text-lg font-semibold mb-2 text-cyan-400">Abilities</h3>
             <ul className="space-y-2 max-h-24 overflow-y-auto pr-2">
                {player.abilities.map(ability => (
                  (ability.id !== 'stat_increase') && (
                    <li key={ability.id} className="text-sm bg-slate-700 p-2 rounded">
                        <div className="flex justify-between items-baseline">
                          <p className="font-bold text-slate-100">{ability.name}</p>
                          <p className="text-xs text-blue-400">{ability.manaCost} Mana</p>
                        </div>
                        <p className="text-slate-400">{ability.description}</p>
                    </li>
                  )
                ))}
             </ul>
           </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
