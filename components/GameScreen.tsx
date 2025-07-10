import React, { useEffect } from 'react';
import { Player, MapCell, Monster } from '../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { PlayerIcon, MonsterIcon, ChestIcon, ExitIcon, QuestMarkerIcon, TrapIcon, VendorIcon } from './icons';

interface GameScreenProps {
  map: MapCell[][];
  player: Player;
  monsters: Monster[];
  onPlayerMove: (dx: number, dy: number) => void;
  backgroundImageUrl: string;
}

const CELL_SIZE = 32; // in pixels

const GameScreen: React.FC<GameScreenProps> = ({ map, player, monsters, onPlayerMove, backgroundImageUrl }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Let escape bubble up for the pause menu
      if (e.key === 'Escape') return;

      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          onPlayerMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          onPlayerMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          onPlayerMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          onPlayerMove(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayerMove]);

  const renderCellContent = (cell: MapCell) => {
    const isQuestTarget = cell.isQuestTarget;
    let icon;
    let color = 'white';

    switch (cell.type) {
      case 'monster':
        color = isQuestTarget ? '#facc15' : '#ef4444'; // yellow-400 or red-500
        icon = <MonsterIcon className="w-full h-full" style={{color}} />;
        break;
      case 'chest':
        color = '#f59e0b'; // amber-500
        icon = <ChestIcon className="w-full h-full" style={{color}} />;
        break;
      case 'exit':
        color = '#a855f7'; // purple-500
        icon = <ExitIcon className="w-full h-full" style={{color}} />;
        break;
      case 'vendor':
        color = '#34d399'; // emerald-400
        icon = <VendorIcon className="w-full h-full" style={{color}} />;
        break;
      case 'trap':
         if (cell.entityId === 'triggered') {
            color = '#9ca3af'; // gray-400
            icon = <TrapIcon className="w-full h-full" style={{color}}/>
         } else {
            return null;
         }
         break;
      default:
        return null;
    }
    
    return (
        <div className="relative w-full h-full" style={{ filter: `drop-shadow(0 0 5px ${color})`}}>
            {icon}
            {isQuestTarget && 
                <QuestMarkerIcon className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" style={{ filter: `drop-shadow(0 0 5px #fde047)`}}/>
            }
        </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg border-2 border-slate-700 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" 
        style={{ backgroundImage: `url(${backgroundImageUrl})`, opacity: 0.5 }}
      ></div>
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${MAP_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, ${CELL_SIZE}px)`,
          width: MAP_WIDTH * CELL_SIZE,
          height: MAP_HEIGHT * CELL_SIZE,
          transform: `translate(calc(50% - ${player.position.x * CELL_SIZE + CELL_SIZE/2}px), calc(50% - ${player.position.y * CELL_SIZE + CELL_SIZE/2}px))`,
          transition: 'transform 0.2s linear'
        }}
      >
        {map.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="relative flex items-center justify-center"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell.type === 'wall' ? 'rgb(51 65 85 / 0.8)' : 'rgb(30 41 59 / 0.6)',
                outline: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {renderCellContent(cell)}
            </div>
          ))
        )}
        <div 
            className="absolute z-10"
            style={{ 
                left: player.position.x * CELL_SIZE, 
                top: player.position.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                filter: 'drop-shadow(0 0 5px #22d3ee)',
            }}
        >
          <PlayerIcon className="w-full h-full text-cyan-400" />
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
