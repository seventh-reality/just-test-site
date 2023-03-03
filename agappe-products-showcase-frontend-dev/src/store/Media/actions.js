import { agappeAPI } from "../../helpers/apiConnector";
import { setMediaDetails, reset } from "./mutation-types";
export default {
    uploadMedia(context, payload) {
        return agappeAPI.post("media", payload).then(() => {
            context.commit(setMediaDetails, {
                name: "",
                path: ""
            });
        });
    },
    resetMedia(context) {
        context.commit(reset);
    },
};