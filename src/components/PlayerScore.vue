<script setup lang="ts">
import { useGameStore, type Player } from "@/composables/game/store";
import { getImageUrl } from "@/utils/getImageUrl";
import { computed } from "vue";

interface PlayerScoreProps {
    player: Player;
}
const props = defineProps<PlayerScoreProps>();
const { store } = useGameStore();

const playerScoreImg = computed(() => {
    return getImageUrl(`player-${props.player}`, "svg");
})
</script>

<template>
    <div
        class="max-w-45 shrink grow sm:max-w-[267px] lg:px-0"
        :class="{
            'pl-4 sm:pl-6.5': player === 'red',
            'pr-4 sm:pr-6.5': player === 'yellow',
        }"
    >
        <div
            class="relative flex flex-col items-center justify-evenly gap-0 rounded-[20px] border-[3px] bg-white py-2.5 text-center hard-shadow-2.5 sm:flex-row sm:gap-2.5 sm:py-3.5 lg:block lg:px-6.5 lg:pt-11.5 lg:pb-4.5"
            :class="{
                'pr-2.5 pl-6': player === 'red',
                'pr-6 pl-2.5': player === 'yellow',
            }"
        >
            <img
                :src="playerScoreImg"
                alt="player score icon"
                class="absolute top-1/2 -translate-y-1/2 lg:top-0"
                :class="{
                    'left-0 -translate-x-1/2 lg:left-1/2': player === 'red',
                    'right-0 translate-x-1/2 lg:right-1/2': player === 'yellow',
                }"
            />
            <p class="text-heading-xs whitespace-nowrap uppercase sm:text-heading-sm">Player {{ player === "red" ? "1" : "2" }}</p>
            <p class="text-heading-lg whitespace-nowrap uppercase sm:text-heading-xl">{{ store.score[player] }}</p>
        </div>
    </div>
</template>
