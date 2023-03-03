export default {
    getUserInfo(state) {
        return state.userData;
    },
    getLoaderData(state) {
        return state.loaderData;
    },
    getModalData(state) {
        return state.modalData;
    },
    getFSStatus(state) {
        return state.fsMode;
    },
    getWTOtatus(state) {
        return state.watchingTimeOver;
    }
    // getDemo(state, getters, rootState, rootGetters) {
    //     return state.demo;
    // }
};