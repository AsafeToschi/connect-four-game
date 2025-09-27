import { onMounted, onUnmounted } from "vue";

const globalListeners = new Map<string, number>();
type TargetEventMap<T> =
    T extends Window ? WindowEventMap :
    T extends Document ? DocumentEventMap :
    T extends HTMLElement ? HTMLElementEventMap :
    GlobalEventHandlersEventMap;

export const useGlobalEventListener = <Target extends EventTarget, K extends keyof TargetEventMap<Target> & string>(target: Target, eventType: K, globalCallback: (ev: TargetEventMap<Target>[K]) => void) => {
    // TODO: find a way to give the target a unique ID per node
    // For now I'm relying on the toString() function the node has
    // Which is terrible, but won't break the app now
    const uniqueKey = `${target}.${eventType}.${globalCallback.name}`;
    onMounted(() => {
        const listenerCounter = globalListeners.get(uniqueKey);
        if (!!listenerCounter) {
            globalListeners.set(uniqueKey, listenerCounter + 1);
            return;
        }

        // console.log("addEventListener: ", uniqueKey)
        target.addEventListener(eventType, globalCallback as EventListener);
        globalListeners.set(uniqueKey, 1);
    });

    onUnmounted(() => {
        const listenerCounter = globalListeners.get(uniqueKey);
        if (!listenerCounter) {
            return
        }

        if (listenerCounter > 1) {
            globalListeners.set(uniqueKey, listenerCounter - 1);
            return
        }

        // console.log("removeEventListener")
        target.removeEventListener(eventType, globalCallback as EventListener);
        globalListeners.delete(uniqueKey);
    });
}
