import type { KeyboardKey } from "@/types/keyboardKeys";
import { onMounted, onUnmounted, reactive, watch } from "vue";

type EventType = "keydown" | "keyup";
interface KeyboardListenerOptions {
    eventType: EventType;
    pressAll: boolean;
    // TODO: caseInsensitive: boolean;
}

type CallbackFunction = (event: KeyboardEvent, keysPressed: Set<KeyboardKey>) => void

// TODO: handle global state event listeners
// if we have more than one component using the global state and we remove the event listener onUnmount it will break
// the other component if one of them unmounts

const globalKeyboardState = reactive({
    isActive: false,
    connectedListeners: 0, // Probably a bad idea
    pressedSimultaneously: new Set<KeyboardKey>()
});

export const useKeyboard = (keyList: KeyboardKey[], callback: CallbackFunction, options?: Partial<KeyboardListenerOptions>) => {
    // Handle multiple keys pressed
    const keysPressedSimultaneously = reactive(new Set<KeyboardKey>());
    const addKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        if (keysPressedSimultaneously.has(key)) {
            return;
        }
        keysPressedSimultaneously.add(key);
    }
    
    const removeKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        keysPressedSimultaneously.delete(key);
    }
    
    onMounted(() => {
        if (!options?.pressAll) {
            return;
        }
        window.addEventListener("keydown", addKeyHandler);
        window.addEventListener("keyup", removeKeyHandler);
    });
    
    onUnmounted(() => {
        if (!options?.pressAll) {
            return;
        }
        window.removeEventListener("keydown", addKeyHandler);
        window.removeEventListener("keyup", removeKeyHandler);
    });
    
    // Handle callback
    const eventHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        if (options?.pressAll) {
            if (!keyList.every((key) => keysPressedSimultaneously.has(key))) {
                return;
            }
        } else {
            if (!keyList.includes(key)) {
                return;
            }
        }

        callback(event, keysPressedSimultaneously);
    };

    onMounted(() => {
        window.addEventListener(options?.eventType || "keydown", eventHandler);
    });

    onUnmounted(() => {
        window.removeEventListener(options?.eventType || "keydown", eventHandler);
    });
};
