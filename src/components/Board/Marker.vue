<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import type { Player } from './Board.vue';

interface MarkerProps {
    position: MarkerPosition;
    player: Player;
    scale: number;
}

interface MarkerPosition {
    col: number;
    row: number;
}

const { position, player, scale } = defineProps<MarkerProps>();
const positionStyle = ref({ top: 0, left: 0 })

const calculatePosition = () => {
    const baseMarkerSize = 70;
    const boardMargin = 17;
    const markerGap = 18;
    positionStyle.value.top = (boardMargin + (baseMarkerSize + markerGap) * (5 - position.row)) * scale;
    positionStyle.value.left = (boardMargin + (baseMarkerSize + markerGap) * position.col) * scale
}

onMounted(() => {
    calculatePosition();
});

onUpdated(() => {
    calculatePosition();
})

</script>
<template>
    <img :src="`src/assets/images/counter-${player}-large.svg`" :alt="`${player} marker - Column ${position.col + 1}. Row ${position.row + 1}`"
        class="absolute top-5 left-5 z-0 ease-in-out transition-[top] origin-top-left" :style="{
            top: `${positionStyle.top}px`,
            left: `${positionStyle.left}px`,
            transform: `scale(${scale})`
        }"
    />
</template>