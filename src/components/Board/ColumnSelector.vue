<script lang="ts">
export interface AddMarkerProps {
    player: Player;
    column: number;
}
</script>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import type { Player } from './GameBoard.vue';

interface ColumnSelectorProps {
    column: number
    scale: number
    currentPlayer: Player;
    disabled: boolean
}

const { column, scale, currentPlayer, disabled } = defineProps<ColumnSelectorProps>();
const emit = defineEmits<{
    addMarker: [AddMarkerProps]
}>()

const positionStyle = ref({ left: 0 })

const calculatePosition = () => {
    const baseMarkerSize = 88;
    const boardMargin = 8;
    positionStyle.value.left = (boardMargin + baseMarkerSize * column) * scale
}

onMounted(() => {
    calculatePosition();
});

onUpdated(() => {
    calculatePosition();
})

const addMarker = () => {
    if (disabled) {
        return;
    }

    emit('addMarker', { player: currentPlayer, column })
}
</script>

<template>
    <div class="absolute top-0 h-full w-[88px] z-10 cursor-pointer group"
        @click="addMarker"
        :style="{
            left: `${positionStyle.left}px`,
            transform: `scaleX(${scale})`
        }"
    >
        <img
            :src="`src/assets/images/marker-${currentPlayer}.png`"
            :class="!disabled ? 'animate-bounce' : 'opacity-65 transform-[translateY(-25%)]'"
            class="absolute hidden group-hover:block -translate-x-1/2 left-1/2 -top-10 select-none ease-in"
        />
    </div>
</template>
