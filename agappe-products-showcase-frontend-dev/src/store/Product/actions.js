import { agappeAPI } from "../../helpers/apiConnector";
import { setProductDetails, setProducts, resetProductList, resetSelectedProduct, setPlayerVisiable } from "./mutation-types";
import { sortBy } from "lodash";
export default {
    getProductList(context) {
        return agappeAPI.get("product").then(response => {
            context.commit(setProductDetails, sortBy(response["products"], ["sequence"]));
            return response;
        });
    },
    selectedProduct(context, payload) {
        context.commit(setProducts, payload);
    },
    addProduct(context, payload) {
        return agappeAPI.post("product", payload).then(() => {
            return context.dispatch("getProductList");
        });
    },
    updateProduct(context, payload) {
        return agappeAPI.patch("product", payload).then(() => {
            return context.dispatch("getProductList");
        });
    },
    deleteProduct(context, payload) {
        return agappeAPI.delete("product", payload).then(() => {
            return context.dispatch("getProductList");
        });
    },
    toggleProductAvailability(context, payload) {
        return agappeAPI.put("product", payload).then(() => {
            return context.dispatch("getProductList");
        });
    },
    resetProductList(context) {
        context.commit(resetProductList);
    },
    resetSelectedProduct(context) {
        context.commit(resetSelectedProduct);
    },
    makePlayerVisible(context, payload) {
        context.commit(setPlayerVisiable, payload);
    }
};
