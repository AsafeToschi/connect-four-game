<script setup lang="ts">
import { useGameStore, type Player } from "@/composables/gameStore";

interface PlayerScoreProps {
    player: Player;
}
const { player } = defineProps<PlayerScoreProps>();
const { state } = useGameStore();
</script>

<template>
    <div class="relative w-35 rounded-[20px] border-[3px] bg-white p-4 pt-11.5 text-center hard-shadow-2.5">
        <img :src="`src/assets/images/player-${player == 'red' ? 'one' : 'two'}.svg`" alt="player score icon" class="absolute top-0 left-1/2 -translate-1/2" />
        <p class="text-heading-xs uppercase">Player {{ player === "red" ? "1" : "2" }}</p>
        <p class="text-heading-xl uppercase">{{ state.score[player] }}</p>
    </div>
</template>
