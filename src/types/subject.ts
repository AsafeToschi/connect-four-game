import type { ObserverOrFunction } from "./observer";

export interface Subject {
    observers: Set<ObserverOrFunction>;
    subscribe: (observer: ObserverOrFunction) => void;
    unsubscribe: (targetObserver: ObserverOrFunction) => void;
    unsubscribeAll: () => void;
    notifyAll: (...args: unknown[]) => void;
}
