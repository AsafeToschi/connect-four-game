<script lang="ts">
export interface GameState {
    currentPlayer: Player;
    isPlaying: boolean;
    score: {
        red: number;
        yellow: number;
    }
}
</script>

<script setup lang="ts">
import Board, { type Player } from '@/components/Board/Board.vue'
import { ref } from 'vue';

const gameState = ref<GameState>({
    currentPlayer: 'red',
    isPlaying: false,
    score: {
        red: 0,
        yellow: 0
    }
})
</script>

<template>
    <main class="min-h-screen w-full bg-purple relative">
        <!-- menu -->
        <!-- board -->
        <Board :state="gameState"/>
        <!-- status -->
    </main>
</template>
