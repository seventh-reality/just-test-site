<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="fixed inset-0 overflow-y-auto z-50"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="getLoaderData.loading"
  >
    <div
      class="
        flex
        items-end
        justify-center
        min-h-screen
        pt-4
        px-4
        pb-20
        text-center
        sm:block sm:p-0
      "
    >
      <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div
        class="fixed inset-0 bg-white transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >

      <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
      <div class="inline-flex items-center justify-center w-full h-full">
        <div
          class="
            flex flex-col
            items-center
            justify-center
            w-full
            h-full
            text-center text-white
            z-50
          "
        >
          <img class="mx-2 h-16 w-72 z-50" src="/images/logo.png" alt="logo" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :class="[
              getLoaderData.size == 'md'
                ? 'w-10 h-10'
                : getLoaderData.size === 'lg'
                ? 'w-12 h-12'
                : getLoaderData.size === 'xl'
                ? 'w-14 h-14'
                : 'w-8 h-8',
              getLoaderData.type === 'success'
                ? 'text-green-500'
                : getLoaderData.type === 'warning'
                ? 'text-yellow-500'
                : getLoaderData.type === 'info'
                ? 'text-blue-500'
                : getLoaderData.type === 'error'
                ? 'text-red-500'
                : 'text-gray-400',
            ]"
            class="animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25 animate-pulse"
              cx="12"
              cy="12"
              r="10"
              stroke="blue"
              stroke-width="4"
            />
            <path
              class="bg-opacity-75 fill-current"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "Loader",
    computed: {
        ...mapGetters("User", ["getLoaderData"]),
    },
};
</script>
