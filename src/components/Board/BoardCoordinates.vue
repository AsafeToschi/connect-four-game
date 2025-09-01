<script setup lang="ts">
import { BOARD_SIZE } from "@/composables/game/gameStore";
</script>

<template>
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
</template>
