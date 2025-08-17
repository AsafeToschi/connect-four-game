import { onMounted, onUnmounted, ref, type Ref } from "vue";

export const useScale = (boardRef: Ref<HTMLInputElement | null>, baseWidth: number) => {
    const scale = ref(1);

    const updateScale = () => {
        if (!boardRef.value) {
            return;
        }

        const currentWidth = boardRef.value.clientWidth;
        const newScale = currentWidth / baseWidth;

        if (newScale === scale.value) {
            return;
        }
        scale.value = newScale;
        console.log("new scale: ", scale.value);
    };

    onMounted(() => {
        window.addEventListener("resize", updateScale);
    });

    onUnmounted(() => {
        window.removeEventListener("resize", updateScale);
    });

    return { scale };
};
