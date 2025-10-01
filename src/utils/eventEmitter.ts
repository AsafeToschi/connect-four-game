interface Event {
    type: string;
    subscriberFn: Function
}

const createEventEmitter = () => {
    const events = new Map<string, Set<Function>>();

    const subscribe = (type: string, subscriberFn: Function) => {
        if (!events.has(type)) {
            events.set(type, new Set())
        }

        const event = events.get(type);
        event?.add(subscriberFn)
    }

    const unsubscribe = ({ type, subscriberFn }: Event) => {
        if (!events.has(type)) {
            return;
        }

        const event = events.get(type);
        event?.delete(subscriberFn)
    }

    const emit = (type: string) => {
        events.get(type)?.forEach((subscriberFn) => {
            subscriberFn()
        })
    }

    return {
        subscribe,
        unsubscribe,
        emit
    }
}

export const eventEmitter = createEventEmitter();
