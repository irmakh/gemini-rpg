import { GameState } from './types';

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;

export const INITIAL_GAME_STATE: GameState = {
  gamePhase: 'menu',
  player: null,
  world: null,
  log: ["Welcome to Gemini RPG!"],
  isLoading: false,
  modalContent: null,
  combatState: null,
  isPaused: false,
  settings: {
    useImagen: true,
  },
};