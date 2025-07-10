

import React, { useRef, useEffect } from 'react';
import { QuestObjective } from '../types';

interface LogPanelProps {
  log: string[];
  quest: QuestObjective | null;
}

const LogPanel: React.FC<LogPanelProps> = ({ log, quest }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
        <div className="flex justify-between items-center mb-3 border-b border-slate-600 pb-2 flex-shrink-0">
             <h2 className="text-xl font-bold text-cyan-400">Event Log</h2>
             {quest && (
                <div className="text-right ml-4">
                    <p className={`font-bold text-base ${quest.isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>{quest.title}</p>
                    <p className="text-sm text-slate-300 italic">{quest.isCompleted ? 'Completed!' : quest.objective}</p>
                </div>
             )}
        </div>
      <div className="overflow-y-auto pr-2 flex-grow">
        {log.map((entry, index) => (
          <p key={index} className={`text-sm mb-1 ${index === log.length - 1 ? 'text-white' : 'text-slate-400'}`}>
            {entry}
          </p>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default LogPanel;
