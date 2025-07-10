import React from 'react';
import { PlayerIcon, MonsterIcon, ChestIcon, ExitIcon, QuestMarkerIcon, TrapIcon, VendorIcon } from './icons';

const Legend: React.FC = () => (
    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs text-slate-300 shadow-lg backdrop-blur-sm">
        <h3 className="font-bold text-base text-cyan-400 mb-2 border-b border-slate-600 pb-1">Legend</h3>
        <ul className="space-y-1">
            <li className="flex items-center gap-2"><PlayerIcon className="w-4 h-4 text-cyan-400"/> Player</li>
            <li className="flex items-center gap-2"><MonsterIcon className="w-4 h-4 text-red-500"/> Monster</li>
            <li className="flex items-center gap-2"><ChestIcon className="w-4 h-4 text-amber-500"/> Treasure</li>
            <li className="flex items-center gap-2"><VendorIcon className="w-4 h-4 text-emerald-400"/> Vendor</li>
            <li className="flex items-center gap-2"><ExitIcon className="w-4 h-4 text-purple-500"/> Exit</li>
            <li className="flex items-center gap-2"><TrapIcon className="w-4 h-4 text-gray-400"/> Triggered Trap</li>
            <li className="flex items-center gap-2"><QuestMarkerIcon className="w-4 h-4 text-yellow-300"/> Quest Target</li>
        </ul>
    </div>
);

export default Legend;
