import { ref } from "vue";
import type { Player } from "./store";
import { defineStore } from "pinia";
import { eventEmitter } from "@/utils/eventEmitter";

const useScoreStore = defineStore("score", () => {
    const players = ref<Map<string, number>>(new Map());
    const getPlayerScore = (player: string) => players.value.get(player);

    eventEmitter.subscribe("status:ended", ({ }) => {
    })

    return {
        players,
        getPlayerScore
    }
})