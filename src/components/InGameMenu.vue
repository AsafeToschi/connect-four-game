<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import Modal from "./common/Modal.vue";
import { restartGame } from "@/composables/game/gameStore";

const handleRestart = (closeModal: () => void) => {
    restartGame();
    closeModal();
};
</script>

<template>
    <div class="flex w-full grow items-end px-5">
        <div class="mx-auto flex w-full max-w-[632px] items-center justify-between py-7.5 text-center lg:py-12.5">
            <Modal bg="purple" overlay="dark">
                <template #button="{ openModal }">
                    <Button type="inGameMenu" color="darkPurple" @click="openModal">Menu</Button>
                </template>
                <template #default="{ closeModal }">
                    <div class="px-5 py-7.5 text-center text-white sm:px-10 sm:py-12.5">
                        <h2 class="mb-11 text-heading-xl uppercase">Pause</h2>
                        <div class="flex flex-wrap gap-7.5">
                            <Button color="white" type="menu" @click="closeModal">Continue Game</Button>
                            <Button color="white" type="menu" @click="handleRestart(closeModal)">Restart</Button>
                            <Button color="red" type="menu" href="/">Quit Game</Button>
                        </div>
                    </div>
                </template>
            </Modal>
            <img src="/src/assets/images/logo.svg" />
            <Button type="inGameMenu" color="darkPurple">Restart</Button>
        </div>
    </div>
</template>
