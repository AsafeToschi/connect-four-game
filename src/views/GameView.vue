<script setup lang="ts">
import Board from "@/components/Board/GameBoard.vue";
import Button from "@/components/common/Button.vue";
import PlayerScore from "@/components/PlayerScore.vue";
import Status from "@/components/StatusBar.vue";
import { reactive, ref } from "vue";

// Hard
// Simulate the next 3 or 4 moves and get a score for each move, based on that score choose the best one
// evaluate my connected markers, oponent connect markers and winnig move (which will score 100)
// a move that results in 2 possible moves with 3 connected lines is also a 100 score as the winning chance is 100%
</script>

<template>
    <main class="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-purple">
        <!-- menu -->
        <div class="flex w-full grow items-end px-5">
            <div class="mx-auto flex w-full max-w-[632px] items-center justify-between py-7.5 lg:py-12.5">
                <Button type="inGameMenu" color="darkPurple" class="inline-block">Menu</Button>
                <img src="/src//assets/images/logo.svg" class="inline-block" />
                <Button type="inGameMenu" color="darkPurple" class="inline-block">Restart</Button>
            </div>
        </div>
        <!-- board -->
        <div
            class="flex min-h-0 shrink-1 grow-0 flex-wrap content-center items-center justify-center gap-x-5 gap-y-12.5 px-5 sm:gap-x-10 sm:gap-y-8 lg:flex-nowrap lg:gap-15"
        >
            <PlayerScore player="red" class="order-1 lg:order-none" />
            <Board class="order-3 min-h-0 lg:order-none" />
            <PlayerScore player="yellow" class="order-2 lg:order-none" />
        </div>
        <!-- status -->
        <Status class="shrink-1 grow" />
    </main>
</template>
