<script setup lang="ts">
import type { GameState, Player, PlayerMove } from "@/data/gameState";

interface StatusBarProps {
    currentPlayer: Player;
    winner: PlayerMove | null;
    gameStatus?: GameState["status"];
}
const { currentPlayer, winner, gameStatus } = defineProps<StatusBarProps>();

console.log("currentPlayer: ", currentPlayer);
console.log("winner: ", winner);
console.log("gameStatus: ", gameStatus);
const availableTime = 14; // temporary fixed value
</script>

<template>
    <div class="relative -top-10 bottom-0 w-full">
        <div class="absolute top-0 left-0 z-0 h-full w-full rounded-t-[60px] bg-dark-purple" :class="winner?.player && `bg-${winner?.player}`"></div>
        <div class="relative z-100 flex justify-center">
            <!-- Game Status  -->
            <template v-if="gameStatus == 'ended'">
                <div>Game Status</div>
            </template>

            <!-- Player turn holder -->
            <template v-else>
                <div class="relative">
                    <img :src="`src/assets/images/turn-background-${currentPlayer}.svg`" class=" " />

                    <div class="absolute top-10 left-0 h-[calc(100%-2.5rem)] w-full p-7.5 pt-0 text-center">
                        <p class="text-heading-xs uppercase">Player {{ currentPlayer == "red" ? "1" : "2" }}'s Turn</p>
                        <span class="text-heading-lg">{{ availableTime }}s</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
