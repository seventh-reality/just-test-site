import { setUserDetails, setLoaderData, reset, resetModal, setModal, resetLoaderData, setNewToken, toggleFSMode, setWatchingTimeOver } from "./mutation-types";
import * as config from "../../config/index.json";
export default {
    [setUserDetails](state, payload) {
        state.userData.name = payload.name;
        state.userData.email = payload.email;
        state.userData.contactNumber = payload.contactNumber;
        state.userData.accessToken = payload.accessToken;
        state.userData.refreshToken = payload.refreshToken;
        state.userData.loggedIn = payload.loggedIn;
        state.userData.loggedInTime = Date.now();
        state.userData.isAdmin = config.adminUserId.includes(payload.id);
    },
    [setNewToken](state, payload) {
        state.userData.accessToken = payload.accessToken;
    },
    [setLoaderData](state, payload) {
        if (!state.loaderData.loading) {
            Object.assign(state.loaderData, payload);
        }
    },
    [resetLoaderData](state) {
        if (state.loaderData.loading) {
            Object.assign(state.loaderData, {
                loading: false,
                type: "info",
                size: "sm"
            });
        }
    },
    [reset](state) {
        state.userData.name = null;
        state.userData.email = null;
        state.userData.contactNumber = null;
        state.userData.accessToken = null;
        state.userData.refreshToken = null;
        state.userData.loggedIn = false;
        state.userData.loggedInTime = null;
        state.userData.isAdmin = false;
        state.userData.id = null;
    },
    [setModal](state, payload) {
        Object.assign(state.modalData, payload);
    },
    [resetModal](state) {
        Object.assign(state.modalData, {
            isOpen: false,
            content: null,
            type: "image",
            url: null,
            name: null,
        });
    },
    [toggleFSMode](state, payload) {
        state.fsMode = payload;
    },
    [setWatchingTimeOver](state, payload) {
        state.watchingTimeOver = payload;
    },
};
