<script setup lang="ts">
import { useGameStore } from "@/composables/game/store";
import { getImageUrl } from "@/utils/getImageUrl";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const { store, restartGame, changeTurn } = useGameStore();

const intervalId = ref<number | null>(null);
const startTime = ref<number | null>(null);
const timer = ref<number | null>(null);
const tickInterval = 100; // ms

const tick = () => {
    if (!startTime.value) {
        return;
    }

    const now = new Date().getTime();
    const timeLimit = store.value.turn.timeLimit * 1000;
    const currentTime = timeLimit - (now - startTime.value);

    if (currentTime <= 0) {
        endTimer();
        timer.value = 0;
        setTimeout(() => {
            changeTurn();
        }, 1000);
        return;
    }

    const newTime = currentTime / 1000;
    const timerPace = 1000 / tickInterval;
    if (currentTime < 1000) {
        timer.value = Math.ceil(newTime * timerPace) / timerPace;
    } else {
        timer.value = Math.ceil(newTime);
    }
};

const startTimer = (interval?: number) => {
    const now = new Date().getTime();
    startTime.value = now;

    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
    intervalId.value = setInterval(tick, interval || tickInterval);
};

const endTimer = () => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
};

watch(
    () => store.value.status,
    (gameStatus) => {
        if (gameStatus === "in game") {
            startTimer();
        } else {
            endTimer();
        }
    }
);

watch(
    () => store.value.turn.player,
    () => startTimer()
);

onMounted(() => {
    if (store.value.status == "in game") {
        startTimer();
    }
});

onUnmounted(() => {
    endTimer();
});

const turnBackgroundImg = computed(() => {
    return getImageUrl(`turn-background-${store.value.turn.player}`, "svg");
})
</script>

<template>
    <div class="relative -top-2.5 -mb-2.5 min-h-50 w-full sm:-top-10 sm:-mb-10">
        <div
            class="absolute top-0 left-0 z-0 h-full w-full rounded-t-[60px] bg-dark-purple"
            :class="{
                'bg-red': store.winner?.player === 'red',
                'bg-yellow': store.winner?.player === 'yellow',
            }"
        />
        <div class="relative z-100 flex justify-center">
            <!-- Game Status  -->
            <div
                v-if="store.status === 'ended'"
                class="relative flex w-71.5 flex-col flex-wrap items-center justify-center rounded-[20px] border-[3px] bg-white p-4 hard-shadow-2.5"
            >
                <p class="text-heading-xs uppercase">Player {{ store.turn.player == "red" ? "1" : "2" }}</p>
                <span class="block text-heading-xl uppercase">Wins</span>
                <button class="white cursor-pointer rounded-full bg-purple px-5.5 py-2.5 text-heading-xs whitespace-nowrap text-white uppercase" @click="restartGame()">
                    Play Again
                </button>
            </div>

            <!-- Player turn holder -->

            <div v-else class="relative" :class="store.turn.player === 'red' && 'text-white'">
                <img :src="turnBackgroundImg" />

                <div class="absolute top-10 left-0 flex h-[calc(100%-2.5rem)] w-full flex-col items-center justify-center px-4 pt-0 pb-7.5 text-center">
                    <template v-if="store.turn.skipped">
                        <p class="text-heading-xs uppercase">Turn</p>
                        <p class="text-heading-lg uppercase">Skipped</p>
                    </template>
                    <template v-else>
                        <p class="text-heading-xs uppercase">Player {{ store.turn.player == "red" ? "1" : "2" }}'s Turn</p>
                        <p class="text-heading-xl">{{ timer }}s</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
