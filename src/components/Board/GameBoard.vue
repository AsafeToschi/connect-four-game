<script setup lang="ts">
import Marker from "./PlayerMarker.vue";
import ColumnSelector from "./ColumnSelector.vue";
import { useGameStore } from "@/composables/game/gameStore";
import { ref } from "vue";
import { useImageScale } from "@/composables/useImageScale";
import { useKeyboard } from "@/composables/useKeyboard";

interface GameBoardProps {}
const props = defineProps<GameBoardProps>();
const { store } = useGameStore();

const boardImageRef = ref<HTMLImageElement | null>(null);
const { scale } = useImageScale(boardImageRef);

// create composable for keyboard event
// create composable for touch swipe event
// update column selector to its own component that is able to select the activeColunmSelector column by itself
</script>

<template>
    <div class="relative z-10 flex h-full max-h-[calc(100%-(93px+50px))] items-center justify-center sm:max-h-[calc(100%-(105px+32px))] lg:max-h-full">
        <div class="relative mx-auto h-full w-fit">
            <picture class="pointer-events-none absolute inset-0 -z-10 block w-full select-none">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-black-small.svg" />
                <img src="@/assets/images/board-layer-black-large.svg" width="632" height="594" alt="board shadow" />
            </picture>
            <picture class="pointer-events-none block h-full select-none">
                <source media="(width < 640px)" srcset="@/assets/images/board-layer-white-small.svg" />
                <img src="@/assets/images/board-layer-white-large.svg" ref="boardImageRef" width="632" height="584" alt="board" class="max-h-full w-auto" />
            </picture>

            <div class="absolute top-0 left-0 -z-1 h-full w-full overflow-hidden rounded-[40px]">
                <template v-for="(column, colIndex) in store.board" :key="colIndex">
                    <template v-for="(playerMove, rowIndex) in column" :key="`${colIndex}-${rowIndex}`">
                        <Marker :playerMove="playerMove" :scale="scale" :debug="false" />
                    </template>
                </template>
            </div>

            <ColumnSelector :scale="scale" />
        </div>
    </div>
</template>
