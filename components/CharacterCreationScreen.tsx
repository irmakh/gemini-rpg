import React, { useState } from 'react';
import { Player, CharacterClass } from '../types';
import * as geminiService from '../services/geminiService';
import { LoadingIcon, StrengthIcon, DexterityIcon, IntelligenceIcon } from './icons';

interface CharacterCreationScreenProps {
  onStartGame: (player: Player) => void;
  useImagen: boolean;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onStartGame, useImagen }) => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState<CharacterClass>('Warrior');
  const [generatedCharacter, setGeneratedCharacter] = useState<Partial<Player> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your hero.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const partialPlayer = await geminiService.generateCharacter(name, characterClass, useImagen);
      setGeneratedCharacter(partialPlayer);
    } catch (e) {
      console.error(e);
      setError("The threads of fate are tangled. Could not create your hero. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStart = () => {
      if(!generatedCharacter) return;

      const baseStats = generatedCharacter.stats ?? { strength: 10, dexterity: 10, intelligence: 10 };
      const maxHp = 20 + baseStats.strength;
      const maxMana = 10 + baseStats.intelligence;

      const finalPlayer: Player = {
          name: name,
          characterClass: characterClass,
          level: 1,
          xp: 0,
          xpToNextLevel: 40,
          hp: maxHp,
          maxHp: maxHp,
          mana: maxMana,
          maxMana: maxMana,
          gold: 25,
          position: { x: 1, y: 1 },
          stats: baseStats,
          inventory: [{id: 'starter_sword', name: 'Rusty Sword', description: 'A basic sword.', type: 'weapon', grade: 'Common', stats: { strength: 1 }, buyPrice: 10, sellPrice: 5, quantity: 1}],
          abilities: [],
          equipment: { weapon: null, armor: null, helmet: null, boots: null, ring: null },
          pendingLevelUps: 0,
          imageUrl: generatedCharacter.imageUrl,
          backstory: generatedCharacter.backstory,
      }
      onStartGame(finalPlayer);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-slate-100 p-4">
      <div className="w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl flex gap-8">
        <div className="w-1/3 flex flex-col">
          <h1 className="text-4xl font-bold text-cyan-400 mb-6">Create Your Hero</h1>
          
          <label htmlFor="name" className="text-slate-400 mb-1">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded p-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading || !!generatedCharacter}
          />

          <label htmlFor="class" className="text-slate-400 mb-1">Class</label>
          <select
            id="class"
            value={characterClass}
            onChange={(e) => setCharacterClass(e.target.value as CharacterClass)}
            className="bg-slate-700 border border-slate-600 rounded p-2 mb-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading || !!generatedCharacter}
          >
            <option>Warrior</option>
            <option>Mage</option>
            <option>Rogue</option>
          </select>
          
          <button
            onClick={generatedCharacter ? handleStart : handleGenerate}
            disabled={isLoading || (generatedCharacter ? false : !name.trim())}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg text-xl transition-colors shadow-lg flex items-center justify-center ${
              isLoading 
                ? 'bg-slate-600 cursor-not-allowed' 
                : generatedCharacter 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-500'
            }`}
          >
            {isLoading && <LoadingIcon className="animate-spin h-6 w-6 mr-3" />}
            {isLoading ? "Forging Fate..." : generatedCharacter ? "Begin Adventure" : "Create Hero"}
          </button>
          
          {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>

        <div className="w-2/3 bg-slate-900/50 p-6 rounded-lg border border-slate-700 flex items-center justify-center">
          {generatedCharacter ? (
            <div className="flex gap-6 w-full animate-fade-in">
              <div className="w-1/2">
                <img src={generatedCharacter.imageUrl} alt="Character Portrait" className="rounded-lg shadow-lg border-2 border-cyan-800"/>
              </div>
              <div className="w-1/2 flex flex-col">
                <h2 className="text-3xl font-bold text-yellow-300">{name}</h2>
                <p className="text-slate-400 mb-4 italic">The {characterClass}</p>
                <p className="text-slate-300 mb-6">{generatedCharacter.backstory}</p>
                
                <h3 className="text-lg font-semibold mb-2 text-cyan-400">Attributes</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-700 p-2 rounded">
                        <StrengthIcon className="h-6 w-6 mx-auto mb-1 text-orange-400" />
                        <p className="font-bold">{generatedCharacter.stats?.strength}</p>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                        <DexterityIcon className="h-6 w-6 mx-auto mb-1 text-lime-400" />
                        <p className="font-bold">{generatedCharacter.stats?.dexterity}</p>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                        <IntelligenceIcon className="h-6 w-6 mx-auto mb-1 text-indigo-400" />
                        <p className="font-bold">{generatedCharacter.stats?.intelligence}</p>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <p>Your hero awaits creation...</p>
            </div>
          )}
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default CharacterCreationScreen;