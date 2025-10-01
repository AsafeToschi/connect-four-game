import { readonly, ref } from "vue";
import { placeMove } from "./placeMove";

export interface GameStore {
    settings: {
        startingPlayer: Player;
    }
    turn: {
        player: Player;
        skipped?: boolean;
        timeLimit: number;
        currentTime?: number; // TODO: add current time
    };
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

const createBoard = (): GameStore["board"] => new Array(7).fill(null).map(() => []);

const createGame = (): GameStore => ({
    settings: {
        startingPlayer: "red",
    },
    turn: {
        player: "red",
        timeLimit: 10,
    },
    isPlaying: false,
    score: {
        red: 0,
        yellow: 0,
    },
    board: createBoard(),
    winner: null,
    status: "in game", // temporary
    // movesHistory: [] // easy mode feature to implement later
});

export const gameStore = ref<GameStore>(createGame());

export const changeTurn = (turn?: Partial<GameStore["turn"]>) => {
    const { player, skipped } = turn || {};
    gameStore.value.turn.player = player || gameStore.value.turn.player == "red" ? "yellow" : "red";
    gameStore.value.turn.skipped = skipped ?? false;

    // merge turn settings
};

export const startNewGame = () => {
    // reset score and game
    gameStore.value = createGame();
};

export const restartGame = () => {
    // TODO: update code to save how started the game to start the next game with the other player if it ends in a draw
    gameStore.value = Object.assign(gameStore.value, {
        winner: null,
        status: "in game",
        board: createBoard(),
    });
    changeTurn();
};

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

        // exposes methods
        changeTurn,
        restartGame,
        endGame,
        startNewGame,
        placeMove,
    };
};


// creates the game with the defaults settings and load custom settings later if found on localStorage or if changed by the user
// This will allow me to initialize the game and than check if there is a need to update the settings
// It would be something like this:
// const game = newGame();
// onMounted(() => {
//      const userSettings = localStorage.getItem("userSettings"))
//      game.settings.update(userSettings);
// })



// Where should I add all the subject.subscribe() calls???