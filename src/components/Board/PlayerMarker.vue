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
const debug = true;

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

const directionMap = {
    "00": '•',
    "01": "↑",
    "11": "↗",
    "10": "→",
    "1-1": "↘",
    "0-1": "↓",
    "-1-1": "↙",
    "-10": "←",
    "-11": "↖",
}

</script>
<template>
    <div class="absolute select-none z-0 ease-in-out duration-500 transition-[top] origin-top-left"
        :style="{
            top: `${positionStyle.top}px`,
            left: `${positionStyle.left}px`,
            transform: `scale(${scale})`,
            zIndex: debug == true ? '10' : '0'
        }"
    >
        <img :src="`src/assets/images/counter-${playerMove.player}-large.svg`" :alt="`${playerMove.player} marker - Column ${playerMove.position.col + 1}. Row ${playerMove.position.row + 1}`"
            class=""
            
        />
        <div v-if="debug === true" class="absolute top-1/2 left-1/2 -translate-1/2 z-30 whitespace-nowrap">
            <div class="flex flex-col font-bold bg-white/50 p-1 border border-black">
                <div v-for="(connection, i) in playerMove.connections" :key="i">
                    <span>
                        C{{ connection.origin.col }} x R{{ connection.origin.row }} | {{ directionMap[`${connection.direction.colStep}${connection.direction.rowStep}`] }}
                    </span>
                    <div class="flex justify-center">
                        <template v-for="n in connection.length" :key="n">
                            ■
                        </template>
                    </div>
                </div>


            </div>
            <!-- {{ playerMove.position.col }} x {{ playerMove.position.row }} -->
        </div>

    </div>
</template>
