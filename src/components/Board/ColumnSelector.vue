<script lang="ts">
export interface AddMarkerProps {
    player: Player;
    column: number;
}
</script>

<script setup lang="ts">
import { useGameStore, type Player } from "@/composables/game/gameStore";
import { computed } from "vue";

interface ColumnSelectorProps {
    column: number;
    disabled: boolean;
    active: boolean;
}

const props = defineProps<ColumnSelectorProps>();
const { store, placeMove } = useGameStore();

const handlePlayerMove = () => {
    if (props.disabled) {
        return;
    }
    placeMove(props.column);
};
</script>

<template>
    <div class="group relative z-10 w-full cursor-pointer" @click="handlePlayerMove">
        <img
            :src="`src/assets/images/marker-${store.turn.player}.png`"
            :class="!disabled ? 'animate-bounce' : 'transform-[translateY(-25%)] opacity-65'"
            class="absolute -top-10 left-1/2 hidden -translate-x-1/2 ease-in select-none group-hover:block"
            :style="{ display: active ? 'block' : '' }"
        />
    </div>
</template>
