<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div>
    <NavigationBar @getSelectedNav="setNav" />
    <main>
      <div class="max-w-full mx-auto lg:py-2 sm:px-1 lg:px-2">
        <!-- Replace with your content -->
        <ProductShowroom v-if="isProduct" />
        <MediaEditor v-if="isEditor" />
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar.vue"; // @ is an alias to /src
import ProductShowroom from "@/components/ProductShowroom.vue";
import MediaEditor from "@/components/Editor.vue";
export default {
    name: "Dashboard",
    components: {
        NavigationBar,
        ProductShowroom,
        MediaEditor
    },
    data: () => ({
        selectedNav: null,
    }),
    computed: {
        isProduct() {
            return this.selectedNav === "Products";
        },
        isEditor() {
            return this.selectedNav === "Editor";
        },
    },
    methods: {
        setNav(event) {
            this.selectedNav = event;
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (!vm.$store.state.User.userData.loggedIn) {
                vm.$router.push({ name: "userAuthentication" });
            }
        });
    },
};
</script>
