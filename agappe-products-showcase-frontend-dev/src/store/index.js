import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
// import * as Cookies from "js-cookie";
import User from "./User/index";
import Product from "./Product/index";
import Media from "./Media/index";
// import SecureLS from "secure-ls";

// const ls = new SecureLS({ isCompression: false, encodingType: "aes", encryptionSecret: "s3cr3tPa$$w0rd@20211023" });

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state: () => ({}),
    plugins: [createPersistedState({
        // storage: {
        //     getItem: key => ls.get(key),
        //     setItem: (key, value) => ls.set(key, value),
        //     removeItem: key => ls.remove(key)
        // },
        // storage: {
        //     getItem: (key) => Cookies.get(key),
        //     // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        //     setItem: (key, value) =>
        //         Cookies.set(key, value, { expires: 7, secure: true }),
        //     removeItem: (key) => Cookies.remove(key),
        // },
        storage: window.sessionStorage
    })],
    mutations: {
    },
    actions: {
    },
    modules: {
        User,
        Media,
        Product
    }
});
