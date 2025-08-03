<script lang="ts">
export type Player = "red" | "yellow";
</script>

<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';
import Marker from './Marker.vue';
import ColumnSelector from './ColumnSelector.vue';
import type { AddMarkerProps } from './ColumnSelector.vue';
import type { GameState } from '@/views/HomeView.vue';

interface BoardProps {
    state: GameState;
}
const { state } = defineProps<BoardProps>()

const board = ref<Player[][]>(new Array(7).fill(null).map(() => []));
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

const handleAddMarker = ({ player, column }: AddMarkerProps) => {
    if (board.value[column].length < 6) {
        board.value[column].push(player);
        
        state.isPlaying = true;
        setTimeout(() => {
            state.isPlaying = false;
        }, 600);

        state.currentPlayer = state.currentPlayer == 'red' ? 'yellow' : 'red'
    } else {
        console.log("this move is not possible")
    }
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
                <template v-for="(player, rowIndex) in column" :key="rowIndex" :id="`${colIndex} - ${rowIndex}`">
                    <Marker :position="{ col: colIndex, row: rowIndex }" :player="player" :scale="scale" />
                </template>
            </template>
        </div>

        <div>
            <template v-for="(column, colIndex) in board" :key="colIndex">
                <ColumnSelector :column="colIndex" :scale="scale" @addMarker="handleAddMarker" :currentPlayer="state.currentPlayer" :disabled="state.isPlaying" />
            </template>
        </div>
    </div>
</template>
