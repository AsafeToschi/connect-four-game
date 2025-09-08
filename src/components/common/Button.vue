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
            'bg-yellow text-black': color === 'yellow',
            'bg-dark-purple text-white': color === 'darkPurple',
            'bg-white text-black': color === 'white',
            'h-18 w-full rounded-[20px] border-[3px] border-black px-5 text-heading-md leading-16.5 hard-shadow-2.5 hover:border-dark-purple hover:hard-shadow-dark-purple':
                type === 'menu',
            'min-w-27 rounded-full px-5 py-2.5 text-heading-xs': type === 'inGameMenu',
            'flex items-center justify-between gap-2.5': $slots.icon,
        }"
        class="cursor-pointer whitespace-nowrap uppercase"
        style="text-align: inherit"
    >
        <slot></slot>
        <div v-if="$slots.icon">
            <slot name="icon"></slot>
        </div>
    </component>
</template>
