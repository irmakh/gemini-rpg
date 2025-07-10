
import React from 'react';
import { Item, ItemGrade } from '../types';
import { WeaponIcon, ArmorIcon, PotionIcon, MiscIcon, RingIcon, HealthIcon, ManaIcon, GemIcon } from './icons';

interface ItemTooltipProps {
  item: Item | null;
  position: { x: number; y: number };
}

const getGradeColor = (grade: ItemGrade | undefined) => {
    switch (grade) {
        case 'Uncommon': return 'text-green-400';
        case 'Rare': return 'text-blue-400';
        case 'Epic': return 'text-purple-500';
        case 'Legendary': return 'text-orange-400';
        default: return 'text-slate-100';
    }
};

const ItemTypeIcon: React.FC<{ type: Item['type'], className?: string }> = ({ type, className = "w-10 h-10" }) => {
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


const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, position }) => {
  if (!item) return null;

  const nameColor = getGradeColor(item.grade);

  return (
    <div
      style={{ left: position.x + 20, top: position.y + 20, position: 'fixed', zIndex: 100 }}
      className="w-72 bg-slate-900/95 border border-slate-600 rounded-lg p-4 shadow-2xl pointer-events-none backdrop-blur-sm animate-fade-in text-sm"
    >
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 bg-slate-800 p-2 rounded-md">
            <ItemTypeIcon type={item.type} />
        </div>
        <div className="flex-grow">
            <h3 className={`font-bold text-lg ${nameColor}`}>
                {item.name}
                {item.quantity > 1 && <span className="text-sm text-slate-300 font-normal ml-1">(x{item.quantity})</span>}
            </h3>
            {item.grade && item.grade !== 'Common' && <p className={`text-xs ${nameColor}`}>({item.grade})</p>}
        </div>
      </div>

      <p className="text-slate-400 italic my-2">{item.description}</p>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-200">
        {item.stats && Object.entries(item.stats).map(([stat, value]) => (
            value && value !== 0 ? (
                <p key={stat} className={value > 0 ? "text-green-300" : "text-red-300"}>
                    <span className="capitalize text-slate-400">{stat}:</span> {value > 0 ? `+${value}`: value}
                </p>
            ) : null
        ))}
        {item.healAmount && <p className="text-red-300 flex items-center gap-1"><HealthIcon className="w-4 h-4" /> Heals {item.healAmount} HP</p>}
        {item.manaAmount && <p className="text-blue-300 flex items-center gap-1"><ManaIcon className="w-4 h-4" /> Restores {item.manaAmount} Mana</p>}
      </div>

       {item.sellPrice && <p className="text-yellow-500 mt-2 pt-2 border-t border-slate-700">Value: {item.sellPrice} Gold</p>}

      <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
              animation: fade-in 0.1s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default ItemTooltip;
