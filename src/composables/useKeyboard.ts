import type { KeyboardKey } from "@/types/keyboardKeys";
import { onMounted, onUnmounted, reactive, watch } from "vue";

type EventType = "keydown" | "keyup";
interface KeyboardListenerOptions {
    eventType: EventType;
    pressAll: boolean;
    repeatOnHold: boolean;
    // TODO: caseInsensitive: boolean;
}

type CallbackFunction = (event: KeyboardEvent, keysPressed: KeyInfo[]) => void

// TODO: handle global state event listeners
// if we have more than one component using the global state and we remove the event listener onUnmount it will break
// the other component if one of them unmounts

const globalKeyboardState = reactive({
    isActive: false,
    connectedListeners: 0, // Probably a bad idea
    pressedSimultaneously: new Set<KeyboardKey>()
});

interface KeyInfo {
    key: KeyboardKey
    isBeingHeld: boolean;
}

export const useKeyboard = (keyList: KeyboardKey[], callback: CallbackFunction, options?: Partial<KeyboardListenerOptions>) => {
    // Handle multiple keys pressed
    const currentKeysPressed = reactive<KeyInfo[]>([]);
    const addKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        const keyPresedIndex = currentKeysPressed.findIndex((keyPressed => keyPressed.key === key));

        if (keyPresedIndex !== -1) {
            currentKeysPressed[keyPresedIndex].isBeingHeld = true;
            return;
        }

        currentKeysPressed.push({ key, isBeingHeld: false });
    }

    const removeKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        const keyPresedIndex = currentKeysPressed.findIndex((keyPressed => keyPressed.key === key));

        currentKeysPressed.splice(keyPresedIndex, 1);
    }

    onMounted(() => {
        if (!options?.pressAll && !options?.repeatOnHold) {
            return;
        }
        window.addEventListener("keydown", addKeyHandler);
        window.addEventListener("keyup", removeKeyHandler);
    });

    onUnmounted(() => {
        if (!options?.pressAll && !options?.repeatOnHold) {
            return;
        }
        window.removeEventListener("keydown", addKeyHandler);
        window.removeEventListener("keyup", removeKeyHandler);
    });

    // Handle callback
    const eventHandler = (event: KeyboardEvent) => {
        const eventKey = event.key as KeyboardKey;
        if (options?.pressAll) {
            if (!keyList.every((key) => currentKeysPressed.find(keyPressed => keyPressed.key === key))) {
                return;
            }
        } else {
            if (!keyList.includes(eventKey)) {
                return;
            }
        }

        const currentKeyPressed = currentKeysPressed.find(keyPressed => keyPressed.key === eventKey)
        if (options?.repeatOnHold && currentKeyPressed?.isBeingHeld) {
            return;
        }

        callback(event, currentKeysPressed);
    };

    onMounted(() => {
        window.addEventListener(options?.eventType || "keydown", eventHandler);
    });

    onUnmounted(() => {
        window.removeEventListener(options?.eventType || "keydown", eventHandler);
    });
};
