import { agappeAPI } from "../../helpers/apiConnector";
import { setModal, resetModal, setUserDetails, setLoaderData, resetLoaderData, reset, setNewToken, toggleFSMode, setWatchingTimeOver } from "./mutation-types";
import router from "../../router/index";
export default {
    initiateUserManagement(context, payload) {
        return agappeAPI.post("user", payload).then(response => {
            if (payload.userSelection === "InitiateAuth") {
                context.commit(setUserDetails, {
                    // @ts-ignore
                    name: response.userData.meta_data.name,
                    // @ts-ignore
                    email: response.userData.email,
                    // @ts-ignore
                    contactNumber: response.userData.contact_number,
                    // @ts-ignore
                    accessToken: response.AuthenticationResult.AccessToken,
                    // @ts-ignore
                    refreshToken: response.AuthenticationResult.RefreshToken,
                    loggedIn: true,
                    // @ts-ignore
                    id: response.userData.id
                });
            }
            return response;
        });
    },
    updateToken(context, payload) {
        context.commit(setNewToken, payload);
    },
    startLoading(context, payload) {
        context.commit(setLoaderData, {
            loading: true,
            type: payload.type,
            size: payload.size
        });
    },
    stopLoading(context) {
        context.commit(resetLoaderData);
    },
    openModal(context, payload) {
        context.commit(setModal, payload);
    },
    closeModal(context) {
        context.commit(resetModal);
    },
    logout(context) {
        context.dispatch("startLoading", { type: "info", size: "lg" });
        // eslint-disable-next-line no-unused-vars
        agappeAPI.post("user", { userSelection: "GlobalSignOut" }).then(r => {
            // console.log(r);
            context.dispatch("reset");
        // eslint-disable-next-line no-unused-vars
        }).catch(e => {
            // console.log(e);
            context.dispatch("reset");
        });
    },
    reset(context) {
        context.commit(reset);
        context.dispatch("stopLoading");
        context.dispatch("Product/makePlayerVisible", false, { root: true });
        context.dispatch("Product/resetSelectedProduct", null, { root: true });
        context.dispatch("Product/resetProductList", null, { root: true });
        context.dispatch("Media/resetMedia", null, { root: true });
        router.push({ name: "userAuthentication" });
    },
    toggleFSMode(context, payload) {
        context.commit(toggleFSMode, payload);
    },
    setWatchingTimeOver(context, payload) {
        context.commit(setWatchingTimeOver, payload);
    },
};
