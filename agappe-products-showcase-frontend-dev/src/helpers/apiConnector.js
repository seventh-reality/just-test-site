/* eslint-disable no-console */
import axios from "axios";
import store from "../store/index";
import { decode } from "jsonwebtoken";
import * as config from "../config/index.json";

axios.defaults.baseURL = config.apiEndpoint;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Request interceptor
axios.interceptors.request.use(async (axiosConfig) => {
    // Do something before request is sent
    // @ts-ignore
    if (store.state.User.userData.accessToken) {
        // @ts-ignore
        const tokenExpTime = decode(store.state.User.userData.accessToken, {
            complete: true,
        }).payload.exp;
        /**
         * check if token present in vuex store is expired or not
         */
        const tokenHasExpired = (Number(tokenExpTime) * 1000 - new Date().getTime()) <= 0;
        if (tokenHasExpired) {
            /**
             * If the token has expired then 
             * getting new token and setting it to vuex store under userData
             */
            // eslint-disable-next-line no-unused-vars
            const response = await fetch(`${config.apiEndpoint}/user`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    // @ts-ignore
                    "Authorization": `Bearer ${store.state.User.userData.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // @ts-ignore
                    "refreshToken": store.state.User.userData.refreshToken,
                    "userSelection": "RefreshTheToken"
                })
            }).then(response => response.json()).then(data => {
                store.dispatch("User/updateToken", { accessToken: data.AuthenticationResult.AccessToken });
                // @ts-ignore
                axiosConfig.headers.Authorization = `Bearer ${data.AuthenticationResult.AccessToken}`;
            // eslint-disable-next-line no-unused-vars
            }).catch((error) => {
                // console.error("Error: ", error);
            });
        } else {
            // @ts-ignore
            axiosConfig.headers.Authorization = `Bearer ${store.state.User.userData.accessToken}`;
        }
    }
    return Promise.resolve(axiosConfig);
}, (error) => Promise.reject(error));

// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        /**
         * agappe backend apis response can be modified here
         */
        // delete response.config.headers.Authorization;
        // delete response.config.headers.RefreshToken;
        if (response.data) return Promise.resolve(response.data);
        else return Promise.resolve(response);
    },
    (error) => {
        // console.log(error);
        if (error["response"]) {
            // Do something with response error
            if (error.response.status === 401) {
                // delete the access token, refresh token
                delete error.response.config.headers.Authorization;
                // delete error.response.config.headers.RefreshToken;
                store.dispatch("User/logout");
            }
            return Promise.reject(error.response);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
        }
        return Promise.reject(error);
    }
);

export { axios as agappeAPI };
