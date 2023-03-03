import { setMediaDetails, reset } from "./mutation-types";

export default {
    [setMediaDetails](state, payload) {
        state.mediaData.name = payload.name;
        state.mediaData.path = payload.path;
    },
    [reset](state) {
        state.mediaData.name = null;
        state.mediaData.path = null;
    }
};