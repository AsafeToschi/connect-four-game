<script lang="ts">
export type Player = "red" | "yellow";
</script>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Marker from './Marker.vue';
import ColumnSelector from './ColumnSelector.vue';

const board = ref<Player[][]>(new Array(7).fill(null).map(() => []));
const boardRef = ref<HTMLInputElement | null>(null);

onUnmounted(() => {
    board.value = new Array(7).fill(null).map(() => []);
})

const updateScale = () => {
    if (!boardRef.value) {
        return;
    }

    const baseWidth = 632;
    const currentWidth = boardRef.value.clientWidth;
    scale.value = currentWidth / baseWidth;
}

onMounted(() => {
    window.addEventListener("resize", updateScale);
})

onUnmounted(() => {
    window.removeEventListener("resize", updateScale);
})

const scale = ref(1);

const handleAddMarker = ({ player, column }: { player: Player, column: number}) => {
    if (board.value[column].length < 6) {
        board.value[column].push(player);
    } else {
        console.log("this move is not possible")
    }
}
</script>

<template>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-max">
        <img src="@/assets/images/board-layer-white-large.svg" alt="board" class="absolute max-w-[632px] w-full z-1" ref="boardRef" @load="updateScale" />
        <img src="@/assets/images/board-layer-black-large.svg" alt="board shadow" class="max-w-[632px] w-full -z-1" />
        
        <template v-for="(column, colIndex) in board" :key="colIndex">
            <ColumnSelector :column="colIndex" :scale="scale" @addMarker="handleAddMarker" />
            <div v-for="(player, rowIndex) in column" :key="rowIndex">
                <Marker :position="{ col: colIndex, row: rowIndex }" :player="player" :scale="scale" />
            </div>
        </template>
        
    </div>
</template>
