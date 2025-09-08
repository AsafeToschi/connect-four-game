import { readonly, ref } from "vue";
import { placeMove } from "./placeMove";

export interface GameStore {
    turn: {
        player: Player;
        skipped?: boolean;
        timeLimit: number;
        currentTime?: number; // TODO: add current time
    };
    starterPlayer: Player;
    isPlaying: boolean;
    score: {
        [key in Player]: number;
    };
    board: PlayerMove[][];
    winner: PlayerMove | null;
    status: "idle" | "in game" | "ended";
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

export const BOARD_SIZE = {
    rows: 6,
    cols: 7,
};

const getInitialBoardState = (): GameStore["board"] => new Array(7).fill(null).map(() => []);
const getInitialGameState = (): GameStore => ({
    turn: {
        player: "red",
        timeLimit: 10,
    },
    starterPlayer: "red",
    isPlaying: false,
    score: {
        red: 999,
        yellow: 999,
    },
    board: getInitialBoardState(),
    winner: null,
    status: "in game", // temporary
    // movesHistory: [] // easy mode feature to implement later
});

export const gameStore = ref<GameStore>(getInitialGameState());

// Temp export
export const changeTurn = (params?: Partial<GameStore["turn"]>) => {
    const { player, skipped } = params || {};
    gameStore.value.turn.player = player || gameStore.value.turn.player == "red" ? "yellow" : "red";
    gameStore.value.turn.skipped = skipped ?? false;

    // merge turn settings
};

// Temp export
export const startNewGame = () => {
    // reset score and game
    gameStore.value = getInitialGameState();
};

// Temp export
export const restartGame = () => {
    // TODO: update code to save how started the game to start the next game with the other player if it ends in a draw
    gameStore.value = Object.assign(gameStore.value, {
        winner: null,
        status: "in game",
        board: getInitialBoardState(),
    });
    changeTurn();
};

// Temp export
export const endGame = (playerMove: PlayerMove) => {
    // sets winner, update score and status
    gameStore.value = Object.assign(gameStore.value, {
        winner: playerMove,
        status: "ended",
    });

    gameStore.value.score[playerMove.player]++;

    // stop timmer
};

export const useGameStore = () => {
    const readOnlyGameStore = readonly(gameStore);

    return {
        store: readOnlyGameStore,
        // gameStore, // exposes gameStore until we finish migrating all methods

        // exposes methods
        changeTurn,
        restartGame,
        endGame,
        startNewGame,
        placeMove,
    };
};
