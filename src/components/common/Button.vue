<script setup lang="ts">
import { RouterLink } from "vue-router";
interface ButtonProps {
    type: "menu" | "inGameMenu";
    href?: string;
    color: "red" | "yellow" | "darkPurple" | "white";
}
const props = defineProps<ButtonProps>();
</script>

<template>
    <component
        :is="href ? RouterLink : 'button'"
        :to="href"
        :class="{
            'bg-red text-white': color === 'red',
            'bg-yellow': color === 'yellow',
            'bg-dark-purple text-white': color === 'darkPurple',
            'bg-white': color === 'white',
            'min-h-18 w-full rounded-[20px] border-[3px] border-black px-5 text-heading-md hard-shadow-2.5 hover:border-dark-purple hover:hard-shadow-dark-purple':
                type === 'menu',
            'min-w-27 rounded-full px-5 py-2.5 text-heading-xs': type === 'inGameMenu',
            'justify-between gap-2.5': $slots.icon,
        }"
        class="flex cursor-pointer items-center uppercase"
    >
        <slot></slot>
        <div v-if="$slots.icon">
            <slot name="icon"></slot>
        </div>
    </component>
</template>
