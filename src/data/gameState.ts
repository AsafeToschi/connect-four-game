import { ref } from "vue";

export interface GameState {
    currentPlayer: Player;
    isPlaying: boolean;
    score: {
        red: number;
        yellow: number;
    };
    winner: PlayerMove | null;
    status: "in game" | "ended" | "idle";
    // movesHistory: PlayerMove[]
}

export type Player = "red" | "yellow";
export interface Connection {
    length: number;
    direction: {
        colStep: number; // number between -1 and 1
        rowStep: number; // number between -1 and 1
    };
    origin: MarkerPosition;
}

export interface PlayerMove {
    player: Player;
    position: MarkerPosition;
    connections: Connection[];
}

export interface MarkerPosition {
    col: number;
    row: number;
}

export const gameState = ref<GameState>({
    currentPlayer: "red",
    isPlaying: false,
    score: {
        red: 0,
        yellow: 0,
    },
    winner: null,
    status: "in game", // temporary
    // movesHistory: [] // easy mode feature to implement later
});
