
import React, { useState } from 'react';
import { Player, Vendor, Item, ItemType } from '../types';
import { PotionIcon, WeaponIcon, ArmorIcon, MiscIcon } from './icons';

interface VendorScreenProps {
  player: Player;
  vendor: Vendor;
  onBuy: (item: Item, vendorId: string) => void;
  onSell: (item: Item) => void;
  onClose?: () => void;
}

const ItemTypeIcon: React.FC<{ type: ItemType }> = ({ type }) => {
    const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
    switch (type) {
        case 'weapon': return <WeaponIcon className={`${iconClass} text-orange-400`} />;
        case 'armor': 
        case 'helmet':
        case 'boots':
            return <ArmorIcon className={`${iconClass} text-sky-400`} />;
        case 'ring': return <MiscIcon className={`${iconClass} text-yellow-300`} />;
        case 'potion': return <PotionIcon className={`${iconClass} text-pink-400`} />;
        case 'misc': return <MiscIcon className={`${iconClass} text-gray-400`} />;
        default: return null;
    }
}

const VendorItemRow: React.FC<{
    item: Item;
    playerGold: number;
    action: 'buy' | 'sell';
    onTransaction: (item: Item) => void;
}> = ({ item, playerGold, action, onTransaction }) => {
    const price = action === 'buy' ? item.buyPrice : item.sellPrice;
    const canAfford = action === 'buy' ? playerGold >= (item.buyPrice || Infinity) : true;
    
    return (
        <div className="flex items-center gap-4 p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/80">
            <ItemTypeIcon type={item.type} />
            <div className="flex-grow">
                <p className="font-bold text-yellow-300">{item.name}</p>
                <p className="text-xs text-slate-400 italic">{item.description}</p>
                 <div className="flex gap-4 text-xs mt-1">
                    {item.stats && Object.entries(item.stats).map(([stat, val]) => val !== 0 && <span key={stat}>{stat.slice(0,3).toUpperCase()}: {val > 0 ? `+${val}`: val}</span>)}
                    {item.healAmount && <span className="text-red-400">Heal: {item.healAmount}</span>}
                    {item.manaAmount && <span className="text-blue-400">Mana: {item.manaAmount}</span>}
                </div>
            </div>
            <div className="flex-shrink-0 text-right">
                <button
                    onClick={() => onTransaction(item)}
                    disabled={!canAfford && action === 'buy'}
                    className={`text-sm font-bold py-1 px-4 rounded transition-colors ${
                        action === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-500' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {action === 'buy' ? 'Buy' : 'Sell'}
                </button>
                <p className={`text-sm font-semibold mt-1 ${!canAfford && action === 'buy' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {price} Gold
                </p>
            </div>
        </div>
    );
};

const VendorScreen: React.FC<VendorScreenProps> = ({ player, vendor, onBuy, onSell, onClose }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  return (
    <div className="w-full max-w-2xl max-h-[80vh] flex flex-col">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b border-slate-600 pb-2">Vendor</h2>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex border-b border-slate-600">
            <button 
                onClick={() => setActiveTab('buy')}
                className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'buy' ? 'text-green-400 border-b-2 border-green-400' : 'text-slate-400 hover:text-white'}`}
            >
                Buy
            </button>
            <button 
                onClick={() => setActiveTab('sell')}
                className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'sell' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
                Sell
            </button>
        </div>
        <div className="text-lg font-bold text-yellow-400 bg-slate-900 px-3 py-1 rounded-md">
            Your Gold: {player.gold}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        {activeTab === 'buy' && (
            vendor.inventory.length > 0 ? vendor.inventory.map(item => (
                <VendorItemRow 
                    key={item.id} 
                    item={item} 
                    playerGold={player.gold} 
                    action="buy" 
                    onTransaction={(i) => onBuy(i, vendor.id)}
                />
            )) : <p className="text-slate-500 text-center py-8">I'm all out of stock!</p>
        )}
        {activeTab === 'sell' && (
             player.inventory.length > 0 ? player.inventory.map(item => (
                <VendorItemRow 
                    key={item.id} 
                    item={item} 
                    playerGold={player.gold} 
                    action="sell" 
                    onTransaction={onSell}
                />
            )) : <p className="text-slate-500 text-center py-8">You have nothing to sell.</p>
        )}
      </div>

    </div>
  );
};

export default VendorScreen;
