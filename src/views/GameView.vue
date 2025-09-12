<script setup lang="ts">
import Board from "@/components/Board/GameBoard.vue";
import InGameMenu from "@/components/InGameMenu.vue";
import PlayerScore from "@/components/PlayerScore.vue";
import Status from "@/components/StatusBar.vue";
import PageTrack from "@/components/PageTrack.vue";
import { reactive, ref } from "vue";

const boardContainerRef = ref();

// Hard
// Simulate the next 3 or 4 moves and get a score for each move, based on that score choose the best one
// evaluate my connected markers, oponent connect markers and winnig move (which will score 100)
// a move that results in 2 possible moves with 3 connected lines is also a 100 score as the winning chance is 100%
</script>

<template>
    <main class="flex h-svh w-full flex-col items-center justify-center bg-purple">
        <PageTrack position="top" color="purple" />
        <PageTrack position="bottom" color="darkPurple" />
        <!-- menu -->
        <InGameMenu />
        <!-- board -->
        <div
            class="flex min-h-0 shrink flex-wrap items-center justify-center gap-x-5 gap-y-12.5 px-5 sm:gap-x-10 sm:gap-y-8 lg:flex-row lg:flex-nowrap lg:gap-15"
            ref="boardContainerRef"
        >
            <PlayerScore player="red" class="order-1 lg:order-none" />
            <Board class="order-3 min-h-0 shrink grow basis-full lg:order-none" :boardContainer="boardContainerRef" />
            <PlayerScore player="yellow" class="order-2 lg:order-none" />
        </div>
        <!-- status -->
        <Status class="shrink grow" />
    </main>
</template>
