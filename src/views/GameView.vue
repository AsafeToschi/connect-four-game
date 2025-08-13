<script setup lang="ts">
import Board from "@/components/Board/GameBoard.vue";
import Status from "@/components/StatusBar.vue";
import { gameState } from "@/data/gameState";
import type { PlayerMove } from "@/data/gameState";

// Hard
// Simulate the next 3 or 4 moves and get a score for each move, based on that score choose the best one
// evaluate my connected markers, oponent connect markers and winnig move (which will score 100)
// a move that results in 2 possible moves with 3 connected lines is also a 100 score as the winning chance is 100%

const onPlayerMove = (playerMove: PlayerMove) => {
    gameState.value.isPlaying = true;
    setTimeout(() => {
        gameState.value.isPlaying = false;
    }, 600);

    const winner = playerMove.connections.find((connection) => connection.length >= 4);

    if (!winner) {
        gameState.value.currentPlayer = gameState.value.currentPlayer == "red" ? "yellow" : "red";
    } else {
        gameState.value = {
            ...gameState.value,
            winner: playerMove,
            status: "ended",
        };
        gameState.value.score[playerMove.player] += 1;
    }
};

const restartGame = () => {
    gameState.value = {
        ...gameState.value,
        currentPlayer: gameState.value.currentPlayer == "red" ? "yellow" : "red",
        winner: null,
        status: "in game",
    };
};
</script>

<template>
    <main class="bg-purple relative min-h-screen w-full">
        <div class="flex flex-wrap items-center justify-center">
            <!-- menu -->
            <!-- board -->
            <Board :state="gameState" @playerMove="onPlayerMove" />
            <!-- status -->
            <Status :currentPlayer="gameState.currentPlayer" :winner="gameState.winner" :gameStatus="gameState.status" />
        </div>
        <div
            v-if="gameState.winner"
            class="-translate-1/2 fixed left-1/2 top-1/2 z-30 rounded-2xl border-t border-t-[#00000011] bg-white p-5 text-center text-xl font-bold shadow-2xl"
        >
            Player {{ gameState.winner.player == "red" ? "1" : "2" }} wins!
            <p class="block cursor-pointer underline" @click="restartGame">Restart game</p>
        </div>
    </main>
</template>
