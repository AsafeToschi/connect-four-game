import { readonly, ref } from "vue";

export interface GameState {
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

const getInitialBoardState = (): GameState["board"] => new Array(7).fill(null).map(() => []);
const getInitialGameState = (): GameState => ({
    turn: {
        player: "red",
        timeLimit: 90,
    },
    starterPlayer: "red",
    isPlaying: false,
    score: {
        red: 0,
        yellow: 0,
    },
    board: getInitialBoardState(),
    winner: null,
    status: "in game", // temporary
    // movesHistory: [] // easy mode feature to implement later
});

export const BOARD_SIZE = {
    rows: 6,
    cols: 7,
};

const gameState = ref<GameState>(getInitialGameState());

const getPlayerSurroundingMoves = (currentPlayerMove: PlayerMove) => {
    const currentMovePosition = currentPlayerMove.position;
    const surroundingMoves: PlayerMove[] = [];
    let colOffset = currentMovePosition.col == 0 ? 0 : -1;
    let rowOffset = currentMovePosition.row == 0 ? 0 : -1;
    while (colOffset <= 1 && rowOffset <= 1) {
        const playerMove = gameState.value.board[currentMovePosition.col + colOffset]?.[currentMovePosition.row + rowOffset];
        if (!playerMove || (colOffset === 0 && rowOffset === 0)) {
            // player move not found
            colOffset += 1;
            rowOffset = currentMovePosition.row == 0 ? 0 : -1;
            continue;
        }

        if (playerMove.player === currentPlayerMove.player) {
            surroundingMoves.push(playerMove);
        }

        rowOffset += 1;
        if (rowOffset > 1) {
            colOffset += 1;
            rowOffset = currentMovePosition.row == 0 ? 0 : -1;
        }
    }

    return surroundingMoves;
};

const updateConnectionOrigin = (connection: Connection, currentPlayerMove: PlayerMove) => {
    const { origin, length, direction } = connection;

    // update origin
    connection.origin = {
        col: origin.col + (length - 1) * direction.colStep,
        row: origin.row + (length - 1) * direction.rowStep,
    };

    // invert direction
    connection.direction.colStep *= -1;
    connection.direction.rowStep *= -1;

    // reset length and check for new connections
    updateLineConnection(connection, currentPlayerMove.player);
};

const updateLineConnection = (currentConnection: Connection, currentPlayer: Player) => {
    let col = currentConnection.origin.col + currentConnection.length * currentConnection.direction.colStep;
    let row = currentConnection.origin.row + currentConnection.length * currentConnection.direction.rowStep;
    let player = gameState.value.board[col]?.[row]?.player;

    while (player === currentPlayer) {
        const playerMove = gameState.value.board[col]?.[row];

        const connectionIndex = playerMove?.connections?.findIndex((connection) => {
            return isSameLine(currentConnection, connection) && currentConnection.origin !== connection.origin;
        });

        if (connectionIndex >= 0) {
            playerMove.connections[connectionIndex] = currentConnection;
        }

        if (playerMove?.connections?.length == 0) {
            playerMove.connections.push(currentConnection);
        }

        currentConnection.length++;
        col += currentConnection.direction.colStep;
        row += currentConnection.direction.rowStep;
        player = gameState.value.board[col]?.[row]?.player;
    }
};

const isSameLine = (connectionOne: Connection, connectionTwo: Connection) => {
    const isSameColDirection = connectionOne.direction.colStep == connectionTwo.direction.colStep || connectionOne.direction.colStep - connectionTwo.direction.colStep == 0;
    const isSameRowDirection = connectionOne.direction.rowStep == connectionTwo.direction.rowStep || connectionOne.direction.rowStep - connectionTwo.direction.rowStep == 0;

    return isSameColDirection && isSameRowDirection;
};

const createConnection = (startPosition: MarkerPosition, finalPosition: MarkerPosition, player: Player) => {
    const connection = {
        length: 2,
        direction: {
            colStep: finalPosition.col - startPosition.col,
            rowStep: finalPosition.row - startPosition.row,
        },
        origin: {
            col: startPosition.col,
            row: startPosition.row,
        },
    };

    gameState.value.board[startPosition.col][startPosition.row].connections.push(connection);
    gameState.value.board[finalPosition.col][finalPosition.row].connections.push(connection);

    updateLineConnection(connection, player);
};

const setConnections = (currentPlayerMove: PlayerMove) => {
    const playerSurroundingMoves = getPlayerSurroundingMoves(currentPlayerMove);
    for (const surroundingMove of playerSurroundingMoves) {
        const connection = surroundingMove.connections.find(({ origin, direction }) => {
            const isSameCol = origin.col == currentPlayerMove.position.col && direction.colStep == 0;
            const isSameRow = origin.row == currentPlayerMove.position.row && direction.rowStep == 0;

            const colDistance = (origin.col - currentPlayerMove.position.col) * direction.colStep;
            const rowDistance = (origin.row - currentPlayerMove.position.row) * direction.rowStep;
            const isSameDiagonal = colDistance === rowDistance && direction.colStep !== 0 && direction.rowStep !== 0;

            return isSameRow || isSameCol || isSameDiagonal;
        });

        if (!connection) {
            createConnection(surroundingMove.position, currentPlayerMove.position, currentPlayerMove.player);
            continue;
        }

        const isDuplicateConnection = currentPlayerMove.connections.find((currentMoveConnection) => {
            return isSameLine(currentMoveConnection, connection);
        });

        if (isDuplicateConnection) {
            continue;
        }

        // verifies if the current player move is before the origin or after
        const isSameColDirection = connection.origin.col + connection.length * connection.direction.colStep === currentPlayerMove.position.col;
        const isSameRowDirection = connection.origin.row + connection.length * connection.direction.rowStep === currentPlayerMove.position.row;

        if (!isSameColDirection || !isSameRowDirection) {
            updateConnectionOrigin(connection, currentPlayerMove);
        } else {
            currentPlayerMove.connections.push(connection);
            updateLineConnection(connection, currentPlayerMove.player);
        }
    }
};

const createPlayerMove = (player: Player, column: number) => {
    const row = gameState.value.board[column].length;
    const currentPlayerMove: PlayerMove = {
        player,
        position: { col: column, row },
        connections: [],
    };

    return currentPlayerMove;
};

// handle player move
const placeMove = (column: number) => {
    if (gameState.value.board[column].length >= BOARD_SIZE.rows) {
        console.log("this move is not possible");
        return;
    }
    const player = gameState.value.turn.player;
    const playerMove = createPlayerMove(player, column);

    gameState.value.board[column].push(playerMove);
    setConnections(playerMove);

    if (playerMove.connections.find((connection) => connection.length >= 4)) {
        endGame(playerMove);
        return;
    }

    changeTurn();
};

// handle game turn change
const changeTurn = (params?: Partial<GameState["turn"]>) => {
    const { player, skipped } = params || {};
    gameState.value.turn.player = player || gameState.value.turn.player == "red" ? "yellow" : "red";
    gameState.value.turn.skipped = skipped ?? false;

    // merge turn settings
};

// handle new game
const startNewGame = () => {
    // reset score and game
    gameState.value = getInitialGameState();
};

const restartGame = () => {
    // TODO: update code to save how started the game to start the next game with the other player if it ends in a draw
    gameState.value = Object.assign(gameState.value, {
        winner: null,
        status: "in game",
        board: getInitialBoardState(),
    });
    changeTurn();
};

// handle new game
const endGame = (playerMove: PlayerMove) => {
    // sets winner, update score and status
    gameState.value = Object.assign(gameState.value, {
        winner: playerMove,
        status: "ended",
    });

    gameState.value.score[playerMove.player]++;

    // stop timmer
};

// not sure if I should use "useGameState" or just "useGame" instead
export const useGameStore = () => {
    const readOnlyGameState = readonly(gameState);

    return {
        state: readOnlyGameState,
        // gameState, // exposes gameState until we finish migrating all methods

        // exposes methods
        changeTurn,
        restartGame,
        endGame,
        startNewGame,
        placeMove,
    };
};
