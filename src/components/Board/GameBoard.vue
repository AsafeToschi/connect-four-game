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
const boardRef = ref<HTMLInputElement | null>(null);

const updateScale = () => {
    if (!boardRef.value) {
        return;
    }

    const baseWidth = 632;
    const currentWidth = boardRef.value.clientWidth;
    scale.value = currentWidth / baseWidth;
}

onMounted(() => {
    window.addEventListener("resize", updateScale);
})

onUnmounted(() => {
    window.removeEventListener("resize", updateScale);
})

const scale = ref(1);

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
    const newCol = origin.col + (length - 1) * direction.colStep;
    const newRow = origin.row + (length - 1) * direction.rowStep;
    connection.origin = {
        col: newCol,
        row: newRow
    }
    
    // invert direction
    connection.direction.colStep *= -1;
    connection.direction.rowStep *= -1;
    
    let player: Player = currentPlayerMove.player;
    let col = connection.origin.col
    let row = connection.origin.row
    
    // reset length and check for new connection
    connection.length = 0;
    while (player === currentPlayerMove.player) {
        const boardPositionPlayer = board.value[col]?.[row]?.player;
        if (boardPositionPlayer === currentPlayerMove.player) {
            connection.length++;
            col += connection.direction.colStep
            row += connection.direction.rowStep
        } else {
            player = boardPositionPlayer;
        }
    }
}

const createNewConnection = (startPosition: MarkerPosition, finalPosition: MarkerPosition) => {
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
    
    return connection
}

const getConnections = (currentPlayerMove: PlayerMove) => {
    const playerSurroundingMoves = getPlayerSurroundingMoves(currentPlayerMove);
    debugger;

    const connections = playerSurroundingMoves.map((surroundingMove) => {
        const connection = surroundingMove.connections.find(({ origin, direction }) => {
            const isSameCol = origin.col == currentPlayerMove.position.col && direction.colStep == 0;
            const isSameRow = origin.row == currentPlayerMove.position.row && direction.rowStep == 0;

            const colDistance = origin.col - currentPlayerMove.position.col * direction.colStep
            const rowDistance = origin.row - currentPlayerMove.position.row * direction.rowStep
            const isSameDiagonal = colDistance === rowDistance
            
            return isSameRow || isSameCol || isSameDiagonal
        })

        // debugger;
        if (!connection) {
            return createNewConnection(surroundingMove.position, currentPlayerMove.position);
        }

        // verify if the current player move is before the origin or after
        const isSameColDirection = (connection.origin.col + (connection.length * connection.direction.colStep)) === currentPlayerMove.position.col;
        const isSameRowDirection = (connection.origin.row + (connection.length * connection.direction.rowStep)) === currentPlayerMove.position.row;
        
        if (!isSameColDirection || !isSameRowDirection) {
            updateConnectionOrigin(connection, currentPlayerMove);
        } else {
            connection.length += 1;
        }

        return connection;
    
    })

    return connections;
}

const handleAddMarker = ({ player, column }: AddMarkerProps) => {
    if (board.value[column].length >= BOARD_SIZE.rows) {
        console.log("this move is not possible");
        return;
    }

    // represents the player move row
    const row = board.value[column].length;
    const currentPlayerMove: PlayerMove = {
        player,
        position: { col: column, row },
        connections: []
    };
    
    // Find a way to update all connections 
    board.value[column].push(currentPlayerMove); 
    currentPlayerMove.connections = getConnections(currentPlayerMove);
    
    emit('playerMove', currentPlayerMove);
}
</script>

<template>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-max">
        <div>
            <img src="@/assets/images/board-layer-white-large.svg" alt="board" class="absolute max-w-[632px] w-full select-none z-1" ref="boardRef" @load="updateScale" />
            <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" class="max-w-[632px] w-full select-none -z-1" />
        </div>

        <div class="absolute w-full h-full top-0 left-0 overflow-hidden rounded-[40px]">
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                    <Marker :playerMove="playerMove" :scale="scale" />
                </template>
            </template>
        </div>

        <div>
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <ColumnSelector :column="colIndex" :scale="scale" @addMarker="handleAddMarker"
                    :currentPlayer="state.currentPlayer" :disabled="state.isPlaying || column.length >= BOARD_SIZE.cols || !!state.winner" />
            </template>
        </div>
    </div>
</template>
