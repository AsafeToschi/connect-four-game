<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";

interface ModalProps {
    bg: "white" | "purple";
    isOpen?: boolean;
    overlay?: "transparent" | "dark" | "purple";
}

const props = withDefaults(defineProps<ModalProps>(), {
    isOpen: true,
});

const slots = defineSlots<{
    default(props: { closeModal: () => void }): any;
    button(props: { openModal: () => void }): any;
}>();

const internalIsOpen = ref(false);
const openModal = () => {
    internalIsOpen.value = true;
};

const closeModal = () => {
    internalIsOpen.value = false;
};

const showModal = computed(() => (props.isOpen && !slots.button) || internalIsOpen.value);
</script>

<template>
    <slot name="button" :openModal="openModal"></slot>
    <Teleport to="#modals">
        <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
            <div
                v-if="showModal"
                class="fixed inset-0 z-100 duration-500"
                :class="{
                    'bg-black/60': overlay === 'dark',
                    'bg-purple': overlay === 'purple',
                }"
            ></div>
        </Transition>

        <!-- TODO: create this transition animation in the main.css file to avoid utility class conflicts and make code a bit cleaner -->
        <Transition
            enter-from-class="!top-0 -translate-y-full"
            enter-active-class="ease-modal-in"
            leave-active-class="ease-modal-out"
            leave-to-class="top-full translate-y-full"
        >
            <div v-show="showModal" class="fixed top-1/2 left-1/2 z-101 w-full max-w-130 -translate-1/2 px-5 duration-500">
                <div
                    class="relative max-h-[90svh] rounded-[40px] border-[3px] shadow-[0_10px_0_0_#000]"
                    :class="{
                        'bg-purple': bg === 'purple',
                        'bg-white': bg === 'white',
                    }"
                >
                    <slot :closeModal="closeModal"></slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
