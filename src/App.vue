<script setup lang="ts">
import TouchTracker from "./components/utils/TouchTracker.vue";
</script>

<template>
    <TouchTracker />
    <RouterView v-slot="{ Component }">
        <Transition
            enter-from-class="-translate-y-[calc(100%+120px)]"
            enter-active-class="!fixed ease-modal-in duration-700"
            leave-active-class="!fixed ease-modal-in duration-700"
            leave-to-class="translate-y-[calc(100%+120px)]"
        >
            <component :is="Component" />
        </Transition>
    </RouterView>
</template>
