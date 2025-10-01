<script setup lang="ts">
import type { PlayerMove } from "@/composables/game/store";
import { getImageUrl } from "@/utils/getImageUrl";
import { computed, onMounted, onUpdated, ref, watch, type DeepReadonly } from "vue";

interface MarkerProps {
    playerMove: DeepReadonly<PlayerMove>;
    scale: number;
    debug: boolean;
}

const props = defineProps<MarkerProps>();

// TODO: Apply gravity effect with javascript
const shouldAnimate = ref(false);
const delayedRowPosition = ref(6);
const timeoutId = ref<number | null>(null);
watch(
    () => props.scale,
    () => {
        if (timeoutId.value) {
            clearTimeout(timeoutId.value);
        }

        shouldAnimate.value = false;
        timeoutId.value = setTimeout(() => {
            shouldAnimate.value = true;
        }, 200);
    }
);

onMounted(() => {
    setTimeout(() => {
        shouldAnimate.value = true;
        delayedRowPosition.value = props.playerMove.position.row;
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

const playerSmallMarkerImg = computed(() => {
    return getImageUrl(`counter-${props.playerMove.player}-small`, "svg");
});

const playerMarkerImg = computed(() => {
    return getImageUrl(`counter-${props.playerMove.player}-large`, "svg");
});
</script>

<template>
    <div
        class="marker absolute origin-top-left select-none"
        :style="{
            top: `calc((var(--board-margin) + (var(--base-marker-height) + var(--marker-gap)) * (5 - ${delayedRowPosition})) * ${scale})`,
            left: `calc((var(--board-margin) + (var(--base-marker-width) + var(--marker-gap)) * ${playerMove.position.col}) * ${scale})`,
            scale: scale,
        }"
        :class="{
            'before:absolute before:top-1/2 before:left-1/2 before:box-border before:size-5 before:-translate-1/2 before:rounded-full before:border-[6px] before:border-white sm:before:size-8.5':
                isWinningMove,
            'transition-[top] duration-500 ease-in-out': shouldAnimate,
        }"
    >
        <picture class="pointer-events-none">
            <source media="(width < 640px)" :srcset="playerSmallMarkerImg" />
            <img
                :src="playerMarkerImg"
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

<style>
.marker {
    --base-marker-height: 40px;
    --base-marker-width: 40px;
    --board-margin: 6.5px;
    --marker-gap: 6.72px;
}

@media (width > 40rem) {
    .marker {
        --base-marker-height: 70px;
        --base-marker-width: 70px;
        --board-margin: 17px;
        --marker-gap: 18px;
    }
}
</style>
