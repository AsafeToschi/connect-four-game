<script setup lang="ts">
import type { PlayerMove } from "@/composables/game/gameStore";
import { computed, onMounted, onUpdated, ref, watch, type DeepReadonly } from "vue";

interface MarkerProps {
    playerMove: DeepReadonly<PlayerMove>;
    scale: number;
    debug: boolean;
}

const props = defineProps<MarkerProps>();
const positionStyle = ref({ top: -80, left: 0 });

// TODO: Apply gravity effect with javascript
const shouldAnimate = ref(true);

const calculatePosition = () => {
    const baseMarkerSize = 70;
    const boardMargin = 17;
    const markerGap = 18;
    positionStyle.value.top = (boardMargin + (baseMarkerSize + markerGap) * (5 - props.playerMove.position.row)) * props.scale;
    positionStyle.value.left = (boardMargin + (baseMarkerSize + markerGap) * props.playerMove.position.col) * props.scale;
};

const timeoutId = ref<number | null>(null);
watch(
    () => props.scale,
    () => {
        // console.log("scale changed");
        if (timeoutId.value) {
            clearTimeout(timeoutId.value);
        }

        shouldAnimate.value = false;
        calculatePosition();
        timeoutId.value = setTimeout(() => (shouldAnimate.value = true), 200);
    }
);

onMounted(() => {
    setTimeout(() => {
        calculatePosition();
    }, 100);
});

const isWinningMove = computed(() => {
    return !!props.playerMove.connections.find((connection) => connection.length >= 4);
});

// key -> {colDirection}{rowDirection}
const directionMap: { [key: string]: string } = {
    "00": "•", // invalid direction
    "01": "↑",
    "11": "↗",
    "10": "→",
    "1-1": "↘",
    "0-1": "↓", // invalid direction
    "-1-1": "↙",
    "-10": "←",
    "-11": "↖",
};
</script>

<template>
    <div
        class="absolute origin-top-left select-none"
        :style="{
            top: `${positionStyle.top}px`,
            left: `${positionStyle.left}px`,
            scale: scale,
            zIndex: debug == true ? '10' : '',
        }"
        :class="{
            'before:absolute before:top-1/2 before:left-1/2 before:box-border before:h-8.5 before:w-8.5 before:-translate-1/2 before:rounded-full before:border-[6px] before:border-white':
                isWinningMove,
            'transition-[top] duration-500 ease-in-out': shouldAnimate,
        }"
    >
        <picture>
            <source media="(width < 640px)" :srcset="`src/assets/images/counter-${playerMove.player}-small.svg`" />
            <img
                :src="`src/assets/images/counter-${playerMove.player}-large.svg`"
                :alt="`${playerMove.player} marker - Column ${playerMove.position.col + 1}. Row ${playerMove.position.row + 1}`"
            />
        </picture>

        <div v-if="debug === true" class="absolute top-1/2 left-1/2 z-30 -translate-1/2 whitespace-nowrap">
            <div class="flex flex-col border border-black bg-white/50 p-1 font-bold">
                <div v-for="(connection, i) in playerMove.connections" :key="i">
                    <span>
                        C{{ connection.origin.col }} x R{{ connection.origin.row }} | {{ directionMap[`${connection.direction.colStep}${connection.direction.rowStep}`] }}
                    </span>
                    <div class="flex justify-center">
                        <template v-for="n in connection.length" :key="n"> ■ </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
