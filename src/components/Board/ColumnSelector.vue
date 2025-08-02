<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import type { Player } from './Board.vue';


const { column, scale } = defineProps<ColumnSelectorProps>();
const emit = defineEmits<{
    addMarker: [{ player: Player, column: number }]
}>()

const positionStyle = ref({ left: 0 })

interface ColumnSelectorProps {
    column: number
    scale: number
}

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
    emit('addMarker', { player: 'red', column })
}
</script>

<template>
    <div class="absolute top-0 h-full w-[88px] hover:bg-black/30 z-10 cursor-pointer"
        @click="addMarker"
        :style="{
            left: `${positionStyle.left}px`,
            transform: `scaleX(${scale})`
        }"
    >

    </div>
</template>