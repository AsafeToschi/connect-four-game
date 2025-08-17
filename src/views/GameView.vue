<script setup lang="ts">
import Board from "@/components/Board/GameBoard.vue";
import PlayerScore from "@/components/PlayerScore.vue";
import Status from "@/components/StatusBar.vue";

// Hard
// Simulate the next 3 or 4 moves and get a score for each move, based on that score choose the best one
// evaluate my connected markers, oponent connect markers and winnig move (which will score 100)
// a move that results in 2 possible moves with 3 connected lines is also a 100 score as the winning chance is 100%
</script>

<template>
    <main class="relative flex h-svh w-full flex-col items-center justify-center bg-purple">
        <!-- menu -->
        <div class="w-full grow-1 basis-full"></div>
        <!-- board -->
        <div class="flex grow-0 items-center gap-15">
            <PlayerScore player="red" />
            <Board />
            <PlayerScore player="yellow" />
        </div>
        <!-- status -->
        <Status class="grow-1 basis-full" />
    </main>
</template>
