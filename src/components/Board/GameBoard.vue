<script setup lang="ts">
import Marker from "./PlayerMarker.vue";
import ColumnSelector from "./ColumnSelector.vue";
import { useGameStore, BOARD_SIZE } from "@/composables/gameStore";
import { ref } from "vue";
import { useScale } from "@/composables/scale";

const { state } = useGameStore();

const boardRef = ref<HTMLInputElement | null>(null);
const { scale } = useScale(boardRef, 632);
console.log("scale", scale);
</script>

<template>
    <div class="relative z-10 inline-block">
        <div class="relative">
            <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" class="absolute top-0 right-0 bottom-0 left-0 -z-10 w-full select-none" />
            <img src="@/assets/images/board-layer-white-large.svg" alt="board" class="h-full w-full max-w-[632px] select-none" ref="boardRef" />
        </div>

        <div class="absolute top-0 left-0 -z-1 h-full w-full overflow-hidden rounded-[40px]">
            <template v-for="(column, colIndex) in state.board" :key="colIndex">
                <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                    <Marker :playerMove="playerMove" :scale="1" :debug="false" />
                </template>
            </template>
        </div>

        <div class="absolute top-0 left-0 z-50 flex h-full w-full px-2">
            <template v-for="(column, colIndex) in state.board" :key="colIndex">
                <ColumnSelector :column="colIndex" :scale="1" :disabled="state.isPlaying || column.length >= BOARD_SIZE.cols || !!state.winner" />
            </template>
        </div>

        <!-- Board Coordinates - Optional -->
        <div class="absolute top-0 left-0 h-full w-full overflow-hidden rounded-[40px]">
            <div v-for="columnNumber in BOARD_SIZE.cols" :key="columnNumber">
                <span
                    class="absolute bottom-9 font-bold"
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
