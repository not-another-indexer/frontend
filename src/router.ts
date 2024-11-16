import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/register/Register.vue";
import Galleries from "./components/galleries/Galleries.vue";
import SignIn from "./components/sign_in/SignIn.vue";
import Gallery from "./components/gallery/Gallery.vue";
import NotFound from "./components/error/NotFound.vue";

const routes = [
    {
        path: '/',
        redirect: '/sign-in',
    },
    {
        path: '/sign-in',
        component: SignIn,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/user/galleries',
        component: Galleries,
    },
    {
        path: '/user/galleries/:id',
        component: Gallery,
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
    },
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})
