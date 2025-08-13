<script setup lang="ts">
import { ref, watch } from "vue";
import Marker from "./PlayerMarker.vue";
import ColumnSelector from "./ColumnSelector.vue";
import type { AddMarkerProps } from "./ColumnSelector.vue";
import type { Connection, GameState, MarkerPosition, Player, PlayerMove } from "@/data/gameState";

interface BoardProps {
    state: GameState;
}

const { state } = defineProps<BoardProps>();
const emit = defineEmits<{
    playerMove: [PlayerMove];
    gameEnd: [PlayerMove];
}>();

const BOARD_SIZE = {
    rows: 6,
    cols: 7,
};

const board = ref<PlayerMove[][]>(new Array(7).fill(null).map(() => []));

// maybe place it in a composable
// const boardRef = ref<HTMLInputElement | null>(null);
// const scale = ref(1);
// const updateScale = () => {
//     if (!boardRef.value) {
//         return;
//     }

//     const baseWidth = 632;
//     const currentWidth = boardRef.value.clientWidth;
//     scale.value = currentWidth / baseWidth;
// }
// onMounted(() => {
//     window.addEventListener("resize", updateScale);
// })

// onUnmounted(() => {
//     window.removeEventListener("resize", updateScale);
// })

// temporary workaround until update state management
watch(
    () => state.status,
    (newStatus, oldStatus) => {
        if (oldStatus == "ended") {
            board.value = new Array(7).fill(null).map(() => []);
        }
    }
);

const getPlayerSurroundingMoves = (currentPlayerMove: PlayerMove) => {
    const currentMovePosition = currentPlayerMove.position;
    const surroundingMoves: PlayerMove[] = [];
    let colOffset = currentMovePosition.col == 0 ? 0 : -1;
    let rowOffset = currentMovePosition.row == 0 ? 0 : -1;
    while (colOffset <= 1 && rowOffset <= 1) {
        const playerMove = board.value[currentMovePosition.col + colOffset]?.[currentMovePosition.row + rowOffset];
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
    let player = board.value[col]?.[row]?.player;

    while (player === currentPlayer) {
        const playerMove = board.value[col]?.[row];

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
        player = board.value[col]?.[row]?.player;
    }
};

const isSameLine = (connectionOne: Connection, connectionTwo: Connection) => {
    const isSameColDirection = connectionOne.direction.colStep == connectionTwo.direction.colStep || connectionOne.direction.colStep - connectionTwo.direction.colStep == 0;
    const isSameRowDirection = connectionOne.direction.rowStep == connectionTwo.direction.rowStep || connectionOne.direction.rowStep - connectionTwo.direction.rowStep == 0;

    return isSameColDirection && isSameRowDirection;
};

const createNewConnection = (startPosition: MarkerPosition, finalPosition: MarkerPosition, player: Player) => {
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

    board.value[startPosition.col][startPosition.row].connections.push(connection);
    board.value[finalPosition.col][finalPosition.row].connections.push(connection);

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
            createNewConnection(surroundingMove.position, currentPlayerMove.position, currentPlayerMove.player);
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

const handleAddMarker = ({ player, column }: AddMarkerProps) => {
    if (board.value[column].length >= BOARD_SIZE.rows) {
        console.log("this move is not possible");
        return;
    }

    const row = board.value[column].length;
    const currentPlayerMove: PlayerMove = {
        player,
        position: { col: column, row },
        connections: [],
    };

    board.value[column].push(currentPlayerMove);
    setConnections(currentPlayerMove);

    emit("playerMove", currentPlayerMove);
};
</script>

<template>
    <div class="relative z-10">
        <div class="relative">
            <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" class="absolute -z-10 w-full select-none" />
            <img src="@/assets/images/board-layer-white-large.svg" alt="board" class="h-full w-full max-w-[632px] select-none" ref="boardRef" />
        </div>

        <div class="-z-1 absolute left-0 top-0 h-full w-full overflow-hidden rounded-[40px]">
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                    <Marker :playerMove="playerMove" :scale="1" :debug="false" />
                </template>
            </template>
        </div>

        <div class="absolute left-0 top-0 z-50 flex h-full w-full px-2">
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <ColumnSelector
                    :column="colIndex"
                    :scale="1"
                    @addMarker="handleAddMarker"
                    :currentPlayer="state.currentPlayer"
                    :disabled="state.isPlaying || column.length >= BOARD_SIZE.cols || !!state.winner"
                />
            </template>
        </div>

        <!-- Board Coordinates - Optional -->
        <div class="absolute left-0 top-0 h-full w-full overflow-hidden rounded-[40px]">
            <div v-for="columnNumber in BOARD_SIZE.cols" :key="columnNumber">
                <span
                    class="bottom-8.5 absolute font-bold"
                    :style="{
                        right: `${48 + (70 + 18) * (7 - columnNumber)}px`,
                    }"
                >
                    {{ columnNumber }}
                </span>
            </div>
            <div v-for="rowNumber in BOARD_SIZE.rows" :key="rowNumber">
                <span class="absolute left-1.5 font-bold" :style="{ top: `${42 + (70 + 18) * (6 - rowNumber)}px` }">
                    {{ rowNumber }}
                </span>
            </div>
        </div>
    </div>
</template>
