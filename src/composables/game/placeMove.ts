import { BOARD_SIZE, changeTurn, endGame, useGameStore, type Connection, type MarkerPosition, type Player, type PlayerMove } from "./gameStore";
import { gameStore } from "./gameStore";

const getPlayerSurroundingMoves = (currentPlayerMove: PlayerMove) => {
    const currentMovePosition = currentPlayerMove.position;
    const surroundingMoves: PlayerMove[] = [];
    let colOffset = currentMovePosition.col == 0 ? 0 : -1;
    let rowOffset = currentMovePosition.row == 0 ? 0 : -1;
    while (colOffset <= 1 && rowOffset <= 1) {
        const playerMove = gameStore.value.board[currentMovePosition.col + colOffset]?.[currentMovePosition.row + rowOffset];
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
    let player = gameStore.value.board[col]?.[row]?.player;

    while (player === currentPlayer) {
        const playerMove = gameStore.value.board[col]?.[row];

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
        player = gameStore.value.board[col]?.[row]?.player;
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

    gameStore.value.board[startPosition.col][startPosition.row].connections.push(connection);
    gameStore.value.board[finalPosition.col][finalPosition.row].connections.push(connection);

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
    const row = gameStore.value.board[column].length;
    const currentPlayerMove: PlayerMove = {
        player,
        position: { col: column, row },
        connections: [],
    };

    return currentPlayerMove;
};

// handle player move
export const placeMove = (column: number) => {
    if (gameStore.value.board[column].length >= BOARD_SIZE.rows) {
        console.log("this move is not possible");
        return;
    }
    const player = gameStore.value.turn.player;
    const playerMove = createPlayerMove(player, column);

    gameStore.value.board[column].push(playerMove);
    setConnections(playerMove);

    if (playerMove.connections.find((connection) => connection.length >= 4)) {
        endGame(playerMove);
        return;
    }

    changeTurn();
};
