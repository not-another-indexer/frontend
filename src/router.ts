import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/login/Login.vue";

const routes = [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            component: Login,
        }
    ]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})
