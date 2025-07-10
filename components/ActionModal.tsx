
import React from 'react';

interface ActionModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ActionModal: React.FC<ActionModalProps> = ({ onClose, children }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-lg border border-slate-600 w-full max-w-md p-6 text-white animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Close
        </button>
      </div>
       <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default ActionModal;
