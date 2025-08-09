<script lang="ts">
export interface GameState {
    currentPlayer: Player;
    isPlaying: boolean;
    score: {
        red: number;
        yellow: number;
    };
    winner: Player | null;
    // movesHistory: PlayerMove[]
}
</script>

<script setup lang="ts">
import Board, { type Player, type PlayerMove } from '@/components/Board/GameBoard.vue'
import { ref } from 'vue';

// Hard
// Simulate the next 3 or 4 moves and get a score for each move, based on that score choose the best one
// evaluate my connected markers, oponent connect markers and winnig move (which will score 100)
// a move that results in 2 possible moves with 3 connected lines is also a 100 score as the winning chance is 100%
// never start in the sides

const gameState = ref<GameState>({
    currentPlayer: 'red',
    isPlaying: false,
    score: {
        red: 0,
        yellow: 0
    },
    winner: null,
    // movesHistory: []
})

const onPlayerMove = (playerMove: PlayerMove) => {
    gameState.value.isPlaying = true;
    setTimeout(() => {
        gameState.value.isPlaying = false;
    }, 600);

    const winner = playerMove.connections.find(connection => connection.length >= 4);

    if (!winner) {
        gameState.value.currentPlayer = gameState.value.currentPlayer == 'red' ? 'yellow' : 'red'
    } else {
        gameState.value.winner = playerMove.player
    }
}

</script>

<template>
    <main class="min-h-screen w-full bg-purple relative">
        <!-- menu -->
        <!-- board -->
        <Board :state="gameState" @playerMove="onPlayerMove" />
        <!-- status -->
        <div v-if="gameState.winner" class="fixed left-1/2 top-1/2 -translate-1/2 p-5 bg-white shadow-2xl border-t border-t-[#00000011] rounded-2xl font-bold text-xl">
            Player {{ gameState.winner }} wins!
        </div>
    </main>
</template>
