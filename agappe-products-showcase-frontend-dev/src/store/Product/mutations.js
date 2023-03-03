import { setProductDetails, setProducts, resetProductList, resetSelectedProduct, setPlayerVisiable } from "./mutation-types";

export default {
    [setProducts](state, payload) {
        Object.assign(state.selectedProduct, payload);
    },
    [setProductDetails](state, payload) {
        state.availableProducts = [];
        state.availableProducts.push(...payload);
    },
    [resetProductList](state) {
        state.availableProducts = [];
    },
    [resetSelectedProduct](state) {
        state.selectedProduct = {
            created_at: null,
            deleteded_at: null,
            id: null,
            is_discontinued: false,
            meta_data: null,
            name: null,
            value: null,
            updated_at: null,
        };
    },
    [setPlayerVisiable](state, payload) {
        state.loadPlayer = payload;
    }
};
