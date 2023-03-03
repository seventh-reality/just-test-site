<template>
  <FileUpload />
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import FileUpload from "@/components/FileUpload.vue";
export default {
    name: "MediaEditor",
    components: {
        FileUpload
    },
    props: {},
    computed: {
        ...mapGetters("Media", ["getMediaInfo"]),
        ...mapGetters("Media", ["getAvailableProducts", "getSelectedProduct"]),
    },
    methods: {
        ...mapActions("Product", [
            "addProduct",
            "updateProduct",
            "deleteProduct",
            "toggleProductAvailability",
            "resetProduct",
        ]),
        ...mapActions("Media", ["uploadMedia", "resetMedia"]),
    },
};
</script>
