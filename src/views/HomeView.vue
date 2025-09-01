<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import { ref } from "vue";

const isRulesOpen = ref(false);
</script>

<template>
    <div class="relative h-svh w-full border-white bg-dark-purple">
        <Modal bg="purple" overlay="transparent">
            <div class="">
                <img src="@/assets/images/logo.svg" alt="connect four logo" class="mx-auto mt-2.5 mb-17.5" />
            </div>

            <div class="flex flex-wrap gap-7.5">
                <Button type="menu" color="yellow" href="/game">
                    Play VS Player
                    <template #icon>
                        <img src="@/assets/images/player-vs-player.svg" alt="Play vesus Player" class="h-10" />
                    </template>
                </Button>
                <Modal bg="white" overlay="purple" :open="isRulesOpen" @close="isRulesOpen = false">
                    <template #button>
                        <Button type="menu" color="white" @click="isRulesOpen = true">Game Rules</Button>
                    </template>
                </Modal>
            </div>
        </Modal>
    </div>
</template>
