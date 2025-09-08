<script setup lang="ts">
interface PageTrackProps {
    position: "top" | "bottom";
    color: "purple" | "darkPurple";
}
const props = defineProps<PageTrackProps>();
</script>

<template>
    <div
        class="fixed left-0 z-1000 h-30 w-full"
        :class="{
            'bg-dark-purple': color === 'darkPurple',
            'bg-purple': color === 'purple',
            'top-full rounded-b-[60px]': position === 'bottom',
            'bottom-full rounded-t-[60px]': position === 'top',
        }"
    />
</template>
