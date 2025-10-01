<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import { restartGame } from "@/composables/game/store";
import Menu from "./modals/Menu.vue";

</script>

<template>
    <div class="flex w-full grow items-end px-5">
        <div class="mx-auto flex w-full max-w-[350px] items-center justify-between py-7.5 text-center sm:max-w-[493px] lg:max-w-[632px] lg:py-12.5">
            <Menu />
            <img src="/src/assets/images/logo.svg" />
            <Button type="inGameMenu" color="darkPurple" @click="restartGame()">Restart</Button>
        </div>
    </div>
</template>
