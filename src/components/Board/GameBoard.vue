<script setup lang="ts">
import Marker from "./PlayerMarker.vue";
import ColumnSelector from "./ColumnSelector.vue";
import BoardCoordinates from "./BoardCoordinates.vue";
import { useGameStore, BOARD_SIZE } from "@/composables/game/gameStore";
import { onMounted, onUnmounted, ref } from "vue";
import { useScale } from "@/composables/scale";

interface GameBoardProps {
    boardContainer: HTMLDivElement;
}
const props = defineProps<GameBoardProps>();
const { store, placeMove } = useGameStore();

const boardRef = ref<HTMLInputElement | null>(null);
const { scale } = useScale(boardRef, 632);
// TODO: update scale measurement and/or marker placement logic

const activeColunmSelector = ref<number | null>(null);
const handleColumnSelectorKeyEvent = (e: KeyboardEvent) => {
    // console.log("e.key", e.key);
    if (e.key === "ArrowRight") {
        incrementColunmSelector();
    } else if (e.key === "ArrowLeft") {
        decrementColunmSelector();
    }
};

const handlePlaceMoveKeyEvent = (e: KeyboardEvent) => {
    if (activeColunmSelector.value === null || e.key !== "Enter") {
        return;
    }

    placeMove(activeColunmSelector.value);
};

onMounted(() => {
    window.addEventListener("keydown", handleColumnSelectorKeyEvent);
    window.addEventListener("keyup", handlePlaceMoveKeyEvent);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleColumnSelectorKeyEvent);
    window.removeEventListener("keyup", handlePlaceMoveKeyEvent);
});

const incrementColunmSelector = () => {
    if (activeColunmSelector.value === null) {
        activeColunmSelector.value = 0;
        return;
    }
    activeColunmSelector.value = (activeColunmSelector.value + 1) % BOARD_SIZE.cols;
};
const decrementColunmSelector = () => {
    if (activeColunmSelector.value === null) {
        activeColunmSelector.value = 0;
        return;
    }
    activeColunmSelector.value = (activeColunmSelector.value - 1 + BOARD_SIZE.cols) % BOARD_SIZE.cols;
};

const setColunmSelector = (col: number | null) => {
    activeColunmSelector.value = col;
};

// create composable for keyboard event
// create composable for touch swipe event
// update column selector to its own component that is able to select the activeColunmSelector column by itself

// Track the height change and calculate the board height with javascript
// props.boardContainer?.getBoundingClientRect().height;
</script>

<template>
    <div
        class="relative z-10 flex h-full max-h-[calc(100%-(93px+50px))] items-center justify-center sm:max-h-[calc(100%-(105px+32px))] lg:max-h-full"
        @mouseleave="setColunmSelector(null)"
    >
        <div class="relative mx-auto h-full w-fit">
            <picture class="absolute inset-0 -z-10 block w-full select-none">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-black-small.svg" />
                <img src="@/assets/images/board-layer-black-large.svg" width="632" height="594" alt="board shadow" />
            </picture>
            <picture class="block h-full select-none" ref="boardRef">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-white-small.svg" />
                <img src="@/assets/images/board-layer-white-large.svg" width="632" height="584" alt="board" class="max-h-full w-auto" />
            </picture>

            <div class="absolute top-0 left-0 -z-1 h-full w-full overflow-hidden rounded-[40px]">
                <template v-for="(column, colIndex) in store.board" :key="colIndex">
                    <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                        <Marker :playerMove="playerMove" :scale="scale" :debug="false" />
                    </template>
                </template>
            </div>

            <div class="absolute top-0 left-0 z-50 flex h-full w-full px-2">
                <template v-for="(column, colIndex) in store.board" :key="colIndex">
                    <ColumnSelector
                        :column="colIndex"
                        :scale="scale"
                        :disabled="store.isPlaying || column.length >= BOARD_SIZE.rows || !!store.winner"
                        :active="activeColunmSelector === colIndex"
                        @mouseenter="setColunmSelector(colIndex)"
                    />
                </template>
            </div>

            <!-- Board Coordinates - Optional -->
            <!-- <BoardCoordinates /> -->
        </div>
    </div>
</template>
