<script setup lang="ts">
import Marker from "./PlayerMarker.vue";
import ColumnSelector from "./ColumnSelector.vue";
import BoardCoordinates from "./BoardCoordinates.vue";
import { useGameStore, BOARD_SIZE } from "@/composables/game/gameStore";
import { onMounted, onUnmounted, ref, type MaybeRef } from "vue";
import { useScale } from "@/composables/scale";

const { store, placeMove } = useGameStore();

const boardRef = ref<HTMLInputElement | null>(null);
const { scale } = useScale(boardRef, 632);
// console.log("scale", scale);

const activeColunmSelector = ref<number>(0);
const handleKeyUpColumnSelector = (e: KeyboardEvent) => {
    if (e.key == "ArrowRight") {
        incrementColunmSelector();
    } else if (e.key == "ArrowLeft") {
        decrementColunmSelector();
    }
};

onMounted(() => {
    window.addEventListener("keydown", handleKeyUpColumnSelector);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyUpColumnSelector);
});

const incrementColunmSelector = () => {
    activeColunmSelector.value = (activeColunmSelector.value + 1) % BOARD_SIZE.cols;
};
const decrementColunmSelector = () => {
    activeColunmSelector.value = (activeColunmSelector.value - 1 + BOARD_SIZE.cols) % BOARD_SIZE.cols;
};

// create composable for keyboard event
// create composable for touch swipe event
</script>

<template>
    <div class="relative z-10 w-full">
        <div class="relative mx-auto w-fit">
            <picture class="absolute inset-0 -z-10 block w-full select-none">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-black-small.svg" />
                <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" />
            </picture>
            <picture class="block max-w-full select-none" ref="boardRef">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-white-small.svg" />
                <img src="@/assets/images/board-layer-white-large.svg" alt="board" />
            </picture>

            <div class="absolute top-0 left-0 -z-1 h-full w-full overflow-hidden rounded-[40px]">
                <template v-for="(column, colIndex) in store.board" :key="colIndex">
                    <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                        <Marker :playerMove="playerMove" :scale="1" :debug="false" />
                    </template>
                </template>
            </div>

            <div class="absolute top-0 left-0 z-50 flex h-full w-full px-2">
                <template v-for="(column, colIndex) in store.board" :key="colIndex">
                    <ColumnSelector
                        :column="colIndex"
                        :scale="1"
                        :disabled="store.isPlaying || column.length >= BOARD_SIZE.cols || !!store.winner"
                        :active="activeColunmSelector === colIndex"
                    />
                </template>
            </div>

            <!-- Board Coordinates - Optional -->
            <!-- <BoardCoordinates /> -->
        </div>
    </div>
</template>
