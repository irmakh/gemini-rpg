
import React, { useState, useMemo } from 'react';
import { Player, Item, EquipmentSlot, EQUIPMENT_SLOTS } from '../types';
import { WeaponIcon, ArmorIcon, PotionIcon, MiscIcon, RingIcon, HealthIcon, ManaIcon } from './icons';

interface InventoryScreenProps {
  player: Player;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
  onUseItem: (item: Item) => void;
  onClose?: () => void;
}

type SelectedThing = { type: 'item', item: Item } | { type: 'slot', slot: EquipmentSlot };

const ItemTypeIcon: React.FC<{ type: Item['type'] }> = ({ type }) => {
    const iconClass = "w-8 h-8 flex-shrink-0";
    switch (type) {
        case 'weapon': return <WeaponIcon className={`${iconClass} text-orange-400`} />;
        case 'armor': 
        case 'helmet':
        case 'boots':
            return <ArmorIcon className={`${iconClass} text-sky-400`} />;
        case 'ring': return <RingIcon className={`${iconClass} text-yellow-300`} />;
        case 'potion': return <PotionIcon className={`${iconClass} text-pink-400`} />;
        case 'misc': return <MiscIcon className={`${iconClass} text-gray-400`} />;
        default: return null;
    }
}

const ItemDetails: React.FC<{
    selected: SelectedThing | null;
    player: Player;
    onEquip: (item: Item) => void;
    onUnequip: (slot: EquipmentSlot) => void;
    onUse: (item: Item) => void;
}> = ({ selected, player, onEquip, onUnequip, onUse }) => {
    if (!selected) {
        return <div className="flex items-center justify-center h-full text-slate-500"><p>Select an item to see its details.</p></div>;
    }

    const item = selected.type === 'item' ? selected.item : player.equipment[selected.slot];

    if (!item) {
        return <div className="flex items-center justify-center h-full text-slate-500"><p>This equipment slot is empty.</p></div>;
    }
    
    const isEquippable = EQUIPMENT_SLOTS.includes(item.type as EquipmentSlot);
    const isUsable = item.type === 'potion' && (item.healAmount || item.manaAmount);

    return (
        <div className="flex gap-4 h-full">
            <div className="flex-shrink-0 w-1/4 flex flex-col items-center justify-center bg-slate-800/50 p-2 rounded-lg">
                <ItemTypeIcon type={item.type} />
                <h3 className="font-bold text-lg text-yellow-300 mt-2 text-center">{item.name}</h3>
                <p className="text-xs text-yellow-500 mt-1">{item.sellPrice} Gold</p>
            </div>
            <div className="flex-grow">
                <p className="text-sm text-slate-400 italic mb-2">{item.description}</p>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {item.stats && Object.entries(item.stats).map(([stat, value]) => (
                        value && value !== 0 ? (
                            <p key={stat} className={value > 0 ? "text-green-400" : "text-red-400"}>
                                <span className="capitalize text-slate-400">{stat}:</span> {value > 0 ? `+${value}`: value}
                            </p>
                        ) : null
                    ))}
                     {item.healAmount && <p className="text-red-400 flex items-center gap-1"><HealthIcon className="w-4 h-4" /> Heals {item.healAmount} HP</p>}
                     {item.manaAmount && <p className="text-blue-400 flex items-center gap-1"><ManaIcon className="w-4 h-4" /> Restores {item.manaAmount} Mana</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-center w-32">
                 {selected.type === 'item' && isEquippable && <button onClick={() => onEquip(item)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors">Equip</button>}
                 {selected.type === 'item' && isUsable && <button onClick={() => onUse(item)} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-3 rounded transition-colors">Use</button>}
                 {selected.type === 'slot' && item && <button onClick={() => onUnequip(selected.slot)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors">Unequip</button>}
            </div>
        </div>
    )
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ player, onEquipItem, onUnequipItem, onUseItem }) => {
    const [selected, setSelected] = useState<SelectedThing | null>(null);
    
    const sortedInventory = useMemo(() => {
        return [...player.inventory].sort((a,b) => {
            const typeA = EQUIPMENT_SLOTS.includes(a.type as EquipmentSlot) ? 0 : 1;
            const typeB = EQUIPMENT_SLOTS.includes(b.type as EquipmentSlot) ? 0 : 1;
            if (typeA !== typeB) return typeA - typeB;
            return a.name.localeCompare(b.name);
        });
    }, [player.inventory])


  return (
    <div className="w-full max-w-5xl h-[80vh] flex flex-col text-slate-200">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b border-slate-600 pb-2 flex justify-between items-center">
        <span>Inventory</span>
        <span className="text-xl text-yellow-400">{player.gold} Gold</span>
      </h2>
      
      <div className="flex gap-4 flex-grow min-h-0">
        <div className="w-1/3 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-cyan-300">Equipment</h3>
            <div className="space-y-2">
                {EQUIPMENT_SLOTS.map(slot => {
                    const item = player.equipment[slot];
                    const isSelected = selected?.type === 'slot' && selected.slot === slot;
                    return (
                        <div 
                            key={slot}
                            onClick={() => setSelected({ type: 'slot', slot })}
                            className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${isSelected ? 'bg-cyan-800/80 border-cyan-500' : 'bg-slate-700/50 hover:bg-slate-700/80 border-slate-700'} border`}
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center mr-3">
                                {item ? <ItemTypeIcon type={item.type} /> : <span className="text-slate-500 text-2xl">?</span>}
                            </div>
                            <div className="flex-grow">
                                <p className="capitalize text-slate-400 text-sm">{slot}</p>
                                <p className="font-bold text-base">{item?.name || <span className="text-slate-500 italic">Empty</span>}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        
        <div className="w-2/3 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-cyan-300">Backpack ({player.inventory.length})</h3>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 flex-grow overflow-y-auto">
                {sortedInventory.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {sortedInventory.map(item => {
                         const isSelected = selected?.type === 'item' && selected.item.id === item.id;
                         return (
                            <div
                                key={item.id}
                                onClick={() => setSelected({type: 'item', item})}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${isSelected ? 'bg-cyan-800/80 border-cyan-500' : 'bg-slate-700/50 hover:bg-slate-700/80 border-slate-700'} border`}
                            >
                                <ItemTypeIcon type={item.type} />
                                <span className="font-semibold truncate">{item.name}</span>
                            </div>
                         )
                    })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Your backpack is empty.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
       <div className="h-36 mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 flex-shrink-0">
          <ItemDetails
            selected={selected}
            player={player}
            onEquip={onEquipItem}
            onUnequip={onUnequipItem}
            onUse={onUseItem}
          />
      </div>
    </div>
  );
};

export default InventoryScreen;