<script setup lang="ts">
import { BOARD_SIZE, useGameStore, type Player } from "@/composables/game/gameStore";
import { onMounted, onUnmounted, ref } from "vue";

interface ColumnSelectorProps {
    scale: number;
}

const props = defineProps<ColumnSelectorProps>();
const { store, placeMove } = useGameStore();

const handlePlayerMove = () => {
    if (typeof activeColunmSelector.value !== "number") {
        return;
    }

    placeMove(activeColunmSelector.value);
};

const activeColunmSelector = ref<number | null>(null);
const setColunmSelector = (col: number | null) => {
    activeColunmSelector.value = col;
};

const handleColumnSelectorKeyEvent = (e: KeyboardEvent) => {
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

// TODO: add hold to select column functionality on mobile, it will work better than swipe, place move on touchEnd or on double click
// TODO: set isPlaying betweens moves
</script>

<template>
    <div class="absolute top-0 left-0 z-50 flex h-full w-full px-1 sm:px-2" @mouseleave="setColunmSelector(null)">
        <template v-for="column in 7" :key="column">
            <div class="relative z-10 w-full cursor-pointer" @click="handlePlayerMove" @mouseenter="setColunmSelector(column - 1)">
                <img
                    :src="`src/assets/images/marker-${store.turn.player}.png`"
                    :class="
                        !store.isPlaying && store.board[column - 1].length < BOARD_SIZE.rows && !store.winner
                            ? 'animate-bounce'
                            : 'transform-[translateY(-25%)] opacity-65'
                    "
                    class="absolute left-1/2 -mt-[75%] hidden max-w-3/5 -translate-x-1/2 ease-in select-none"
                    :style="{ display: activeColunmSelector === column - 1 ? 'block' : '', scale: scale }"
                />
            </div>
        </template>
    </div>
</template>
