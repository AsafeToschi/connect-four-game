import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/GameView.vue";
import FontTest from "../views/FontTest.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "game",
            component: HomeView,
        },
        {
            path: "/font-test",
            name: "font-test",
            component: FontTest,
        },
    ],
});

export default router;
