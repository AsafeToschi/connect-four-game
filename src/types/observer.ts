
export interface Observer {
    update: Function
}

export type ObserverOrFunction = Observer | Function;