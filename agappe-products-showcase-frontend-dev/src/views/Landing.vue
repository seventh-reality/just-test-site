<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div>
    <NavigationBar @getSelectedNav="setNav" />
    <main>
      <div class="max-w-full mx-auto lg:py-2 sm:px-1 lg:px-2">
        <!-- Replace with your content -->
        <ProductShowroom v-if="isProduct" />
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>
<script>
import NavigationBar from "@/components/NavigationBar.vue"; // @ is an alias to /src
import ProductShowroom from "@/components/ProductShowroom.vue";
export default {
    name: "LandingPage",
    components: {
        NavigationBar,
        ProductShowroom,
    },
    data: () => ({
        selectedNav: null,
    }),
    computed: {
        isProduct() {
            return this.selectedNav === "Products";
        },
    },
    methods: {
        setNav(event) {
            this.selectedNav = event;
        },
    },
};
</script>
