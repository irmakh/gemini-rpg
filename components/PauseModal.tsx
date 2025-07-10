import React from 'react';

interface PauseModalProps {
  onContinue: () => void;
  onSave: () => void;
  onReturnToMenu: () => void;
}

const PauseModal: React.FC<PauseModalProps> = ({ onContinue, onSave, onReturnToMenu }) => {
  // Prevent clicks inside the modal from closing it, if it were wrapped in a closing div
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-slate-800 rounded-xl shadow-lg border border-slate-600 w-full max-w-xs p-6 text-white text-center"
        onClick={handleModalContentClick}
      >
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Paused</h2>
        <div className="flex flex-col gap-3">
          <button onClick={onContinue} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-lg">
            Continue
          </button>
          <button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-lg">
            Save Game
          </button>
          <button onClick={onReturnToMenu} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-lg">
            Return to Main Menu
          </button>
        </div>
      </div>
      <style>{`
          @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          .animate-fade-in {
              animation: fade-in 0.2s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default PauseModal;
