<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";

interface ModalProps {
    bg: "white" | "purple";
    open?: boolean;
    overlay?: "transparent" | "dark" | "purple";
}

const props = withDefaults(defineProps<ModalProps>(), {
    open: true,
});

const emit = defineEmits(["close"]);

const hasCloseListener = computed(() => {
    const instance = getCurrentInstance();
    return !!instance?.vnode.props?.onClose;
});
</script>

<template>
    <slot name="button"></slot>
    <Teleport to="#modals">
        <Transition>
            <div v-if="open" class="fixed inset-0 flex h-svh items-center justify-center p-5">
                <div
                    class="absolute inset-0 -z-1"
                    :class="{
                        'bg-black/50': overlay === 'dark',
                        'bg-purple': overlay === 'purple',
                        'cursor-pointer': hasCloseListener,
                    }"
                    @click="emit('close')"
                ></div>
                <div
                    class="w-full max-w-120 rounded-[40px] border-[3px] px-10 py-12.5 shadow-[0_10px_0_0_#000]"
                    :class="{
                        'bg-purple': bg === 'purple',
                        'bg-white': bg === 'white',
                    }"
                >
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
