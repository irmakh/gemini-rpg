
import React, { useState, useMemo } from 'react';
import { Player, Item, EquipmentSlot, EQUIPMENT_SLOTS, ItemGrade } from '../types';
import { WeaponIcon, ArmorIcon, PotionIcon, MiscIcon, RingIcon, GemIcon } from './icons';
import ItemTooltip from './ItemTooltip';


interface InventoryScreenProps {
  player: Player;
  onItemPrimaryAction: (item: Item) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
  onClose?: () => void;
}

const getGradeStyle = (grade: ItemGrade | undefined, type: 'text' | 'border') => {
    const colorMap: Record<ItemGrade, string> = {
        'Uncommon': 'green',
        'Rare': 'blue',
        'Epic': 'purple',
        'Legendary': 'orange',
        'Common': 'slate',
    };
    const color = grade && colorMap[grade] ? colorMap[grade] : 'slate';

    if (type === 'text') {
        if (grade === 'Legendary') return 'text-orange-400';
        if (color === 'slate') return 'text-slate-300';
        return `text-${color}-400`;
    }
    // border
    if (grade === 'Legendary') return 'border-orange-500/50';
    if (color === 'slate') return 'border-slate-700';
    return `border-${color}-500/50`;
};


const ItemTypeIcon: React.FC<{ type: Item['type'], className?: string }> = ({ type, className = "w-8 h-8" }) => {
    const iconClass = `${className} flex-shrink-0`;
    switch (type) {
        case 'weapon': return <WeaponIcon className={`${iconClass} text-orange-400`} />;
        case 'armor': 
        case 'helmet':
        case 'boots':
            return <ArmorIcon className={`${iconClass} text-sky-400`} />;
        case 'ring': return <RingIcon className={`${iconClass} text-yellow-300`} />;
        case 'potion': return <PotionIcon className={`${iconClass} text-pink-400`} />;
        case 'gem': return <GemIcon className={`${iconClass} text-teal-300`} />;
        case 'misc': return <MiscIcon className={`${iconClass} text-gray-400`} />;
        default: return null;
    }
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ player, onItemPrimaryAction, onUnequipItem }) => {
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const sortedInventory = useMemo(() => {
        const typeOrder: Record<string, number> = { 'weapon': 1, 'armor': 2, 'helmet': 3, 'boots': 4, 'ring': 5, 'potion': 6, 'gem': 7, 'misc': 8 };
        return [...player.inventory].sort((a,b) => {
            const typeA = typeOrder[a.type] ?? 99;
            const typeB = typeOrder[b.type] ?? 99;
            if (typeA !== typeB) return typeA - typeB;
            return a.name.localeCompare(b.name);
        });
    }, [player.inventory]);


  return (
    <div className="w-full max-w-5xl h-[80vh] flex flex-col text-slate-200" onMouseMove={handleMouseMove}>
      <ItemTooltip item={hoveredItem} position={mousePosition} />
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
                    const borderColor = getGradeStyle(item?.grade, 'border');
                    return (
                        <div 
                            key={slot}
                            onClick={() => item && onUnequipItem(slot)}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex items-center p-2 rounded-md transition-all ${item ? 'cursor-pointer' : 'cursor-default'} bg-slate-700/50 hover:bg-slate-700/80 hover:border-cyan-500/50 ${borderColor} border`}
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                                {item ? <ItemTypeIcon type={item.type} className="w-8 h-8"/> : <span className="text-slate-500 text-2xl capitalize">{slot.charAt(0)}</span>}
                            </div>
                            <div className="flex-grow">
                                <p className="capitalize text-slate-400 text-sm">{slot}</p>
                                <p className={`font-bold text-base truncate ${item ? getGradeStyle(item.grade, 'text').replace('text-slate-300', 'text-slate-100') : 'text-slate-500 italic'}`}>{item?.name || 'Empty'}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sortedInventory.map(item => {
                         const borderColor = getGradeStyle(item.grade, 'border');
                         return (
                            <div
                                key={item.id}
                                onClick={() => onItemPrimaryAction(item)}
                                onMouseEnter={() => setHoveredItem(item)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all bg-slate-700/50 hover:bg-slate-700/80 hover:border-cyan-500/50 ${borderColor} border`}
                            >
                                <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0">
                                    <ItemTypeIcon type={item.type} className="w-6 h-6"/>
                                </div>
                                <span className={`font-semibold truncate ${getGradeStyle(item.grade, 'text').replace('text-slate-300', 'text-slate-100')}`}>
                                    {item.name}
                                    {item.quantity > 1 && <span className="text-sm text-slate-300 font-normal ml-1">(x{item.quantity})</span>}
                                </span>
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
    </div>
  );
};

export default InventoryScreen;
