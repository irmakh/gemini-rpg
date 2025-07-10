
import { GameState } from '../types';

export const saveGame = (state: GameState) => {
    const stateJson = JSON.stringify(state, null, 2);
    const blob = new Blob([stateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-rpg-save-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const loadGame = (event: React.ChangeEvent<HTMLInputElement>): Promise<GameState | null> => {
    return new Promise((resolve, reject) => {
        const file = event.target.files?.[0];
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const parsedState = JSON.parse(text);
                    // Basic validation
                    if (parsedState.player && parsedState.world && parsedState.log) {
                        resolve(parsedState as GameState);
                    } else {
                        reject(new Error("Invalid save file structure."));
                    }
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
