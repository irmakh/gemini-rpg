import React from 'react';
import { GameSettings } from '../types';

interface SettingsScreenProps {
  onReturnToMenu: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onReturnToMenu, settings, onSettingsChange }) => {
  
  const handleToggleImagen = () => {
    onSettingsChange({ ...settings, useImagen: !settings.useImagen });
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-slate-100">
      <div className="text-left bg-slate-800/50 p-10 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-sm w-full max-w-lg">
        <h1 className="text-5xl font-bold text-cyan-400 mb-8 text-center" style={{ textShadow: '0 0 10px #22d3ee' }}>
          Settings
        </h1>
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                <div>
                    <label htmlFor="use-imagen" className="font-semibold text-lg text-slate-100">Use Imagen for Image Generation</label>
                    <p className="text-sm text-slate-400">Enables dynamic generation of images for characters, monsters, and maps.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                        type="checkbox" 
                        name="use-imagen" 
                        id="use-imagen" 
                        checked={settings.useImagen}
                        onChange={handleToggleImagen}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label htmlFor="use-imagen" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-600 cursor-pointer"></label>
                </div>
            </div>

            <div className="text-slate-400 text-sm space-y-2">
                <p>Disabling Imagen will use placeholder images and avoid API calls for image generation.</p>
                <p className="text-xs text-slate-500">Note: The API key for Gemini services is managed externally as an environment variable and is required if Imagen is enabled.</p>
            </div>
        </div>
        
        <div className="mt-10">
          <button
            onClick={onReturnToMenu}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Menu
          </button>
        </div>
      </div>
      <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #22d3ee; /* cyan-400 */
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #22d3ee; /* cyan-400 */
        }
        .toggle-checkbox {
            transition: all 0.2s ease-in-out;
        }
       `}</style>
    </div>
  );
};

export default SettingsScreen;