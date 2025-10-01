import type { KeyboardKey } from "@/types/keyboardKeys";
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { useGlobalEventListener } from "./useGlobalEventListener";

type EventType = "keydown" | "keyup";
interface KeyboardListenerOptions {
    eventType: EventType;
    pressAll: boolean;
    preventRepeat: boolean;
    // TODO: caseInsensitive: boolean;
}

type CallbackFunction = (event: KeyboardEvent, keysPressed: KeyInfo[]) => void

// TODO: handle global state event listeners
// if we have more than one component using the global state and we remove the event listener onUnmount it will break
// the other component if one of them unmounts

interface KeyInfo {
    key: KeyboardKey
    isBeingHold: boolean;
}

const globalKeyBinds = reactive(new Set<string>());
const validateKeyBind = (keyBind: KeyboardKey[], pressAll?: boolean) => {
    if (pressAll && globalKeyBinds.has(keyBind.join("+"))) {
        return false;
    }
    if (keyBind.find((key) => globalKeyBinds.has(key))) {
        return false;
    }
    return true;
}

const updateGlobalKeyBind = (keyBind: KeyboardKey[], pressAll?: boolean) => {
    if (pressAll) {
        globalKeyBinds.add(keyBind.join("+"))
        return;
    }

    keyBind.forEach((key) => globalKeyBinds.add(key));
}

export const useKeyboard = (keyBind: KeyboardKey[], callback: CallbackFunction, options?: Partial<KeyboardListenerOptions>) => {
    // Handle multiple keys pressed
    if (!validateKeyBind(keyBind, options?.pressAll)) {
        // TODO: remove this later, temporary
        return {
            globalKeyBinds
        };
    }
    updateGlobalKeyBind(keyBind, options?.pressAll);

    const currentKeysPressed = reactive<KeyInfo[]>([]);
    const addKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        const keyPresedIndex = currentKeysPressed.findIndex((keyPressed => keyPressed.key === key));

        if (keyPresedIndex !== -1) {
            currentKeysPressed[keyPresedIndex].isBeingHold = true;
            return;
        }

        currentKeysPressed.push({ key, isBeingHold: false });
    }

    const removeKeyHandler = (event: KeyboardEvent) => {
        const key = event.key as KeyboardKey;
        const keyPresedIndex = currentKeysPressed.findIndex((keyPressed => keyPressed.key === key));

        currentKeysPressed.splice(keyPresedIndex, 1);
    }

    if (options?.pressAll || options?.preventRepeat) {
        useGlobalEventListener(window, "keydown", addKeyHandler);
        useGlobalEventListener(window, "keyup", removeKeyHandler);
    }

    // Handle callback
    const eventHandler = (event: KeyboardEvent) => {
        const eventKey = event.key as KeyboardKey;
        if (options?.pressAll) {
            if (!keyBind.every((key) => currentKeysPressed.find(keyPressed => keyPressed.key === key))) {
                return;
            }
        } else {
            if (!keyBind.includes(eventKey)) {
                return;
            }
        }

        const currentKeyPressed = currentKeysPressed.find(keyPressed => keyPressed.key === eventKey)
        if (options?.preventRepeat && currentKeyPressed?.isBeingHold) {
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

    return {
        // updateKeyBind
        globalKeyBinds
    }
};
