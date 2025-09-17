import { onMounted, onUnmounted, ref, type Ref } from "vue";

export const useImageScale = (imageRef: Ref<HTMLImageElement | null>) => {
    const scale = ref(1);

    const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
            const imageOriginalWidth = (entry.target as HTMLImageElement).naturalWidth;
            const newScale = entry.contentRect.width / imageOriginalWidth;
            if (newScale === scale.value) {
                return;
            }

            scale.value = !newScale ? 1 : newScale;
        });
    });

    onMounted(() => {
        if (imageRef.value) {
            resizeObserver.observe(imageRef.value);
        }
    });
    onUnmounted(() => {
        resizeObserver.disconnect();
    });

    return { scale };
};
