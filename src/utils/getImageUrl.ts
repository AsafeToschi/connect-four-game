export const getImageUrl = (fileName: string, extension: string) => {
    return new URL(`../assets/images/${fileName}.${extension}`, import.meta.url).href;
}