import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Login from "../views/login.vue";

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '',
            name: 'Home',
            component: Home,
            meta:{title: 'Home'}
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{title: 'Login'}
        },
    ]
});

export default router

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');
    document.title = to.meta.title
    if (authRequired && !loggedIn ) {
        return next({
            path: '/login',
            query: {returnUrl: to.path}
        });
    }
    next();
})
// Add a 401 response interceptor
