<script lang="ts">
export type Player = "red" | "yellow";
export interface Connection {
    length: number;
    direction: {
        colStep: number; // number between -1 and 1
        rowStep: number; // number between -1 and 1
    }
    origin: MarkerPosition;
};

export interface PlayerMove {
    player: Player;
    position: MarkerPosition;
    connections: Connection[];
}

</script>

<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';
import Marker, { type MarkerPosition } from './PlayerMarker.vue';
import ColumnSelector from './ColumnSelector.vue';
import type { AddMarkerProps } from './ColumnSelector.vue';
import type { GameState } from '@/views/GameView.vue';

interface BoardProps {
    state: GameState;
}

const { state } = defineProps<BoardProps>();
const emit = defineEmits<{
    'playerMove': [PlayerMove]
    'gameEnd': [PlayerMove]
}>()

const BOARD_SIZE = {
    rows: 6,
    cols: 7
}

const board = ref<PlayerMove[][]>(new Array(7).fill(null).map(() => []));

// place it in a composable
// const boardRef = ref<HTMLInputElement | null>(null);
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
// const scale = ref(1);


const getPlayerSurroundingMoves = (currentPlayerMove: PlayerMove) => {
    const currentMovePosition = currentPlayerMove.position
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
        
        rowOffset += 1
        if (rowOffset > 1) {
            colOffset += 1;
            rowOffset = currentMovePosition.row == 0 ? 0 : -1;
        }
    }

    return surroundingMoves;
}

const updateConnectionOrigin = (connection: Connection, currentPlayerMove: PlayerMove) => {
    const { origin, length, direction } = connection;

    // update origin
    connection.origin = {
        col: origin.col + (length - 1) * direction.colStep,
        row: origin.row + (length - 1) * direction.rowStep
    }
    
    // invert direction
    connection.direction.colStep *= -1;
    connection.direction.rowStep *= -1;
    
    // reset length and check for new connections
    updateLineConnection(connection, currentPlayerMove.player);
}

const updateLineConnection = (currentConnection: Connection, currentPlayer: Player) => {
    let col = currentConnection.origin.col + currentConnection.length * currentConnection.direction.colStep;
    let row = currentConnection.origin.row + currentConnection.length * currentConnection.direction.rowStep;
    let player = board.value[col]?.[row]?.player;

    while (player === currentPlayer) {
        const playerMove = board.value[col]?.[row];

        const connectionIndex = playerMove?.connections?.findIndex((connection) => {
            return isSameLine(currentConnection, connection) && currentConnection.origin !== connection.origin
        })

        if (connectionIndex >= 0) {
            playerMove.connections[connectionIndex] = currentConnection
        }

        if (playerMove?.connections?.length == 0) {
            playerMove.connections.push(currentConnection);
        }

        currentConnection.length++;
        col += currentConnection.direction.colStep;
        row += currentConnection.direction.rowStep;
        player = board.value[col]?.[row]?.player
    }
}

const isSameLine = (connectionOne: Connection, connectionTwo: Connection) => {
    const isSameColDirection = connectionOne.direction.colStep == connectionTwo.direction.colStep || connectionOne.direction.colStep - connectionTwo.direction.colStep == 0
    const isSameRowDirection = connectionOne.direction.rowStep == connectionTwo.direction.rowStep || connectionOne.direction.rowStep - connectionTwo.direction.rowStep == 0

    return isSameColDirection && isSameRowDirection
}

const createNewConnection = (startPosition: MarkerPosition, finalPosition: MarkerPosition, player: Player) => {
    const connection = {
        length: 2,
        direction: {
            colStep: finalPosition.col - startPosition.col,
            rowStep: finalPosition.row - startPosition.row, 
        },
        origin: {
            col: startPosition.col,
            row: startPosition.row
        }
    }

    board.value[startPosition.col][startPosition.row].connections.push(connection);
    board.value[finalPosition.col][finalPosition.row].connections.push(connection);
    
    updateLineConnection(connection, player);
}

const setConnections = (currentPlayerMove: PlayerMove) => {
    const playerSurroundingMoves = getPlayerSurroundingMoves(currentPlayerMove);

    for (const surroundingMove of playerSurroundingMoves) {
        const connection = surroundingMove.connections.find(({ origin, direction }) => {
            const isSameCol = origin.col == currentPlayerMove.position.col && direction.colStep == 0;
            const isSameRow = origin.row == currentPlayerMove.position.row && direction.rowStep == 0;

            const colDistance = origin.col - currentPlayerMove.position.col * direction.colStep
            const rowDistance = origin.row - currentPlayerMove.position.row * direction.rowStep
            const isSameDiagonal = colDistance === rowDistance && direction.colStep !== 0 && direction.rowStep !== 0;
            
            return isSameRow || isSameCol || isSameDiagonal
        })

        if (!connection) {
            createNewConnection(surroundingMove.position, currentPlayerMove.position, currentPlayerMove.player)
            continue;
        }

        const isDuplicateConnection = currentPlayerMove.connections.find((currentMoveConnection) => {
            return isSameLine(currentMoveConnection, connection)
        })

        if (isDuplicateConnection) {
            continue;
        }

        // verifies if the current player move is before the origin or after
        const isSameColDirection = (connection.origin.col + (connection.length * connection.direction.colStep)) === currentPlayerMove.position.col;
        const isSameRowDirection = (connection.origin.row + (connection.length * connection.direction.rowStep)) === currentPlayerMove.position.row;
        
        if (!isSameColDirection || !isSameRowDirection) {
            updateConnectionOrigin(connection, currentPlayerMove);
        } else {
            updateLineConnection(connection, currentPlayerMove.player)
        }
    }
}

const handleAddMarker = ({ player, column }: AddMarkerProps) => {
    if (board.value[column].length >= BOARD_SIZE.rows) {
        console.log("this move is not possible");
        return;
    }

    const row = board.value[column].length;
    const currentPlayerMove: PlayerMove = {
        player,
        position: { col: column, row },
        connections: []
    };
    
    board.value[column].push(currentPlayerMove); 
    setConnections(currentPlayerMove);
    
    emit('playerMove', currentPlayerMove);
}
</script>

<template>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-max">
        <div>
            <img src="@/assets/images/board-layer-white-large.svg" alt="board" class="absolute max-w-[632px] w-full select-none z-1" ref="boardRef" />
            <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" class="max-w-[632px] w-full select-none -z-1" />
        </div>

        <div class="absolute w-full h-full top-0 left-0 overflow-hidden rounded-[40px]">
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                    <Marker :playerMove="playerMove" :scale="1" />
                </template>
            </template>
        </div>

        <div>
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <ColumnSelector :column="colIndex" :scale="1" @addMarker="handleAddMarker"
                    :currentPlayer="state.currentPlayer" :disabled="state.isPlaying || column.length >= BOARD_SIZE.cols || !!state.winner" />
            </template>
        </div>
    </div>
</template>
