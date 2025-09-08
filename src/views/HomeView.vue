<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import PageTrack from "@/components/PageTrack.vue";
import { ref } from "vue";

const isRulesOpen = ref(false);
</script>

<template>
    <main class="relative flex h-svh w-full items-center justify-center border-white bg-dark-purple px-5">
        <PageTrack position="top" color="darkPurple" />
        <PageTrack position="bottom" color="darkPurple" />
        <div class="w-full max-w-120 rounded-[40px] border-[3px] bg-purple px-5 py-7.5 hard-shadow-2.5 sm:px-10 sm:py-12.5">
            <div class="mt-2.5 mb-17.5">
                <img src="@/assets/images/logo.svg" alt="connect four logo" class="mx-auto" />
            </div>

            <div class="flex flex-wrap gap-7.5 text-left">
                <Button type="menu" color="yellow" href="/game">
                    Play VS Player
                    <template #icon>
                        <img src="@/assets/images/player-vs-player.svg" alt="Play vesus Player" class="h-10" />
                    </template>
                </Button>

                <Modal bg="white" overlay="purple">
                    <template #button="{ openModal }">
                        <Button type="menu" color="white" @click="openModal">Game Rules</Button>
                    </template>
                    <template #default="{ closeModal }">
                        <div class="px-5 py-7.5 text-black/60 sm:px-10 sm:py-12.5">
                            <h2 class="text-center text-heading-xl text-black">RULES</h2>
                            <p class="text-heading-sm text-purple">OBJECTIVE</p>
                            <p>Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).</p>
                            <p class="text-heading-sm text-purple">HOW TO PLAY</p>
                            <ol class="list-decimal pl-6.5 marker:text-heading-xs marker:text-black">
                                <li>
                                    <p>Red goes first in the first game.</p>
                                </li>
                                <li>
                                    <p>Players must alternate turns, and only one disc can be dropped in each turn.</p>
                                </li>
                                <li>
                                    <p>The game ends when there is a 4-in-a-row or a stalemate.</p>
                                </li>
                                <li>
                                    <p>The starter of the previous game goes second on the next game.</p>
                                </li>
                            </ol>
                            <img
                                src="/src/assets/images/icon-check.svg"
                                class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer"
                                @click="closeModal"
                            />
                        </div>
                    </template>
                </Modal>
            </div>
        </div>
    </main>
</template>
