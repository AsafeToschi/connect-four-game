import { onMounted, onUnmounted, ref, toValue, type MaybeRef, type Ref } from "vue";

export const useImageScale = (imageRef: Ref<HTMLImageElement | null>, baseWidth: number) => {
    const scale = ref(1);

    console.log(imageRef.value);

    const updateScale = () => {
        console.log("image log", imageRef.value);
        console.dir(imageRef.value);

        if (!imageRef.value) {
            return;
        }

        console.dir(imageRef.value.getBoundingClientRect());
        console.log("imageRef.value.clientWidth", imageRef.value.clientWidth);
        console.log("imageRef.value.naturalWidth", imageRef.value.naturalWidth);
        const newScale = imageRef.value.clientWidth / imageRef.value.naturalWidth;

        console.log("newScale", newScale);
        if (newScale === scale.value) {
            return;
        }

        scale.value = !newScale ? 1 : newScale;
        console.log("scale: ", scale.value);
    };

    onMounted(() => {
        console.log("mounted");
        updateScale();
        window.addEventListener("resize", updateScale);
    });

    onUnmounted(() => {
        window.removeEventListener("resize", updateScale);
    });

    return { scale };
};
