<script setup lang="ts">
import { useGameStore, type Player } from "@/composables/game/gameStore";

interface PlayerScoreProps {
    player: Player;
}
const props = defineProps<PlayerScoreProps>();
const { store } = useGameStore();
</script>

<template>
    <div
        class="group relative flex w-auto max-w-[267px] shrink grow flex-col items-center justify-center gap-0 rounded-[20px] border-[3px] bg-white px-0 py-2.5 text-center hard-shadow-2.5 sm:flex-row sm:gap-10 sm:py-3.5 lg:block lg:px-6.5 lg:pt-11.5 lg:pb-4.5"
    >
        <img
            :src="`src/assets/images/player-${player == 'red' ? 'one' : 'two'}.svg`"
            alt="player score icon"
            class="absolute top-1/2 -translate-y-1/2 group-first:left-0 group-first:-translate-x-1/2 group-last:right-0 group-last:translate-x-1/2 lg:top-0 lg:group-first:left-1/2 lg:group-last:right-auto lg:group-last:left-1/2 lg:group-last:mr-0 lg:group-last:-translate-x-1/2"
        />
        <p class="text-heading-xs whitespace-nowrap uppercase sm:text-heading-sm">Player {{ player === "red" ? "1" : "2" }}</p>
        <p class="text-heading-lg whitespace-nowrap uppercase sm:text-heading-xl">{{ store.score[player] }}</p>
    </div>
</template>
