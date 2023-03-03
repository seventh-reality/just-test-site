export default {
    getSelectedProduct(state) {
        return state.selectedProduct;
    },
    getAvailableProducts(state) {
        return state.availableProducts;
    },
    getPlayerStatus(state) {
        return state.loadPlayer;
    }
};