import { createRouter, createWebHistory } from "vue-router";
import GameView from "../views/GameView.vue";
import HomeView from "../views/HomeView.vue";
import FontTest from "../views/FontTest.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/game",
            name: "game",
            component: GameView,
        },
        {
            path: "/font-test",
            name: "font-test",
            component: FontTest,
        },
    ],
});

export default router;
