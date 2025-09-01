<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const touchList = ref<TouchList | null>(null);

const updateTouchList = (e: TouchEvent) => {
    // e.preventDefault();

    if (e.type == "touchstart" || e.type == "touchend") {
        console.log("event", e);
    }

    touchList.value = e.touches;
};

onMounted(() => {
    document.addEventListener("touchstart", updateTouchList, { passive: false });
    document.addEventListener("touchmove", updateTouchList, { passive: false });
    document.addEventListener("touchcancel", updateTouchList, { passive: false });
    document.addEventListener("touchend", updateTouchList, { passive: false });
});

onUnmounted(() => {
    document.removeEventListener("touchstart", updateTouchList);
    document.removeEventListener("touchmove", updateTouchList);
    document.removeEventListener("touchcancel", updateTouchList);
    document.removeEventListener("touchend", updateTouchList);
});
</script>

<template>
    <Teleport to="#tracker">
        <div
            class="fixed z-1000 h-7.5 w-7.5 -translate-1/2 rounded-full border bg-red"
            v-for="touch in touchList"
            :key="touch.identifier"
            :style="{ left: `${touch.clientX}px`, top: `${touch.clientY}px` }"
        ></div>
    </Teleport>
</template>
