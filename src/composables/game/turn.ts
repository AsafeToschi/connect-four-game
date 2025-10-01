import { ref } from "vue";
import type { Player } from "./store";
import { defineStore } from "pinia";
import { eventEmitter } from "@/utils/eventEmitter";

const useTurnStore = defineStore('turn', () => {
    const players = ref<Player[]>([]);
    const currentPlayer = ref<Player | null>(null);
    const timeLimit = ref(10);


    const next = () => {
        const currentPlayerIndex = players.value.findIndex(player => player === currentPlayer.value);
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.value.length;
        currentPlayer.value = players.value[nextPlayerIndex];
        eventEmitter.emit("turn:next");
    }

    const changeTimeLimit = (time: number) => {
        if (!Number.isInteger(time) && time < 5) {
            return;
        }
        timeLimit.value = time
    }

    return {
        players,
        currentPlayer,
        timeLimit,
        next,
        changeTimeLimit
    }
})
