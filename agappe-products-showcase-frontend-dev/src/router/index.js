import Vue from "vue";
import VueRouter from "vue-router";
// import store from '../store/index'

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "landing",
        component: () =>
            import(
                /* webpackChunkName: "UserAuthentication" */ "../views/Landing.vue"
            ),
    },
    {
        path: "/authentication",
        name: "userAuthentication",
        component: () =>
            import(
                /* webpackChunkName: "UserAuthentication" */ "../views/UserAuthentication.vue"
            ),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        // route level code-splitting
        // this generates a separate chunk (dashboard.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "Dashboard" */ "../views/Dashboard.vue"),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
