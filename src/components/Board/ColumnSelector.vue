<script lang="ts">
export interface AddMarkerProps {
    player: Player;
    column: number;
}
</script>

<script setup lang="ts">
import type { Player } from "@/data/gameState";

interface ColumnSelectorProps {
    column: number;
    currentPlayer: Player;
    disabled: boolean;
}

const { column, currentPlayer, disabled } = defineProps<ColumnSelectorProps>();
const emit = defineEmits<{
    addMarker: [AddMarkerProps];
}>();

const addMarker = () => {
    if (disabled) {
        return;
    }

    emit("addMarker", { player: currentPlayer, column });
};
</script>

<template>
    <div class="group relative z-10 w-full cursor-pointer" @click="addMarker">
        <img
            :src="`src/assets/images/marker-${currentPlayer}.png`"
            :class="!disabled ? 'animate-bounce' : 'transform-[translateY(-25%)] opacity-65'"
            class="absolute -top-10 left-1/2 hidden -translate-x-1/2 select-none ease-in group-hover:block"
        />
    </div>
</template>
