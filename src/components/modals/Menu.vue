<script setup lang="ts">
import Modal from "@/components/common/Modal.vue";
import Button from "@/components/common/Button.vue";
import { restartGame } from "@/composables/game/gameStore";
import { ref } from "vue";
import { useKeyboard } from "@/composables/useKeyboard";

const isMenuOpened = ref(false);
const toggleModal = () => {
    isMenuOpened.value = !isMenuOpened.value
}

const handleRestart = (closeModal: () => void) => {
    restartGame();
    closeModal();
};

useKeyboard(["Escape", "P", "p"], toggleModal, { repeatOnHold: false })
</script>

<template>
    <Button type="inGameMenu" color="darkPurple" @click="toggleModal">Menu</Button>
    <Modal bg="purple" overlay="dark" :isOpen="isMenuOpened">
        <div class="px-5 py-7.5 text-center text-white sm:px-10 sm:py-12.5">
            <h2 class="mb-11 text-heading-xl uppercase">Pause</h2>
            <div class="flex flex-wrap gap-7.5">
                <Button color="white" type="menu" @click="toggleModal">Continue Game</Button>
                <Button color="white" type="menu" @click="handleRestart">Restart</Button>
                <Button color="red" type="menu" href="/">Quit Game</Button>
            </div>
        </div>
    </Modal>
</template>