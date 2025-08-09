<script lang="ts">

export interface MarkerPosition {
    col: number;
    row: number;
}

</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PlayerMove } from './GameBoard.vue';

interface MarkerProps {
    playerMove: PlayerMove;
    scale: number;
}

const { playerMove, scale } = defineProps<MarkerProps>();
const positionStyle = ref({ top: -80, left: 0 })

// Temporary
// TODO: Apply gravity effect with javascript
const delayedRowPosition = ref(6);

const calculatePosition = () => {
    const baseMarkerSize = 70;
    const boardMargin = 17;
    const markerGap = 18;
    positionStyle.value.top = (boardMargin + (baseMarkerSize + markerGap) * (5 - delayedRowPosition.value)) * scale;
    positionStyle.value.left = (boardMargin + (baseMarkerSize + markerGap) * playerMove.position.col) * scale
}

onMounted(() => {
    setTimeout(() => {
        delayedRowPosition.value = playerMove.position.row;
        calculatePosition();
    }, 100)
});

</script>
<template>
    <div class="absolute select-none z-0 ease-in-out duration-500 transition-[top] origin-top-left"
        :style="{
            top: `${positionStyle.top}px`,
            left: `${positionStyle.left}px`,
            transform: `scale(${scale})`,
        }"
    >
        <img :src="`src/assets/images/counter-${playerMove.player}-large.svg`" :alt="`${playerMove.player} marker - Column ${playerMove.position.col + 1}. Row ${playerMove.position.row + 1}`"
            class=""
            
        />
    </div>
</template>
