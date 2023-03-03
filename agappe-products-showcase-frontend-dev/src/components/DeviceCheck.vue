<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="fixed inset-0 overflow-y-auto z-50"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="showWarning"
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
        class="fixed inset-0 bg-gray-800 transition-opacity"
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
          <img
            class="rounded mx-auto row-span-2"
            src="/images/orientation_checking.png"
            alt="orientation_checking"
          />
          <span class="font-sans p-1 m-1"
            >SWITCH TO LANDSCAPE MODE TO VIEW THE EXPERIENCE</span
          >
          <span class="font-sans p-1 m-1"
            >FOR BETTER EXPERIENCE USE FULLSCREEN</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Device } from "../helpers/device";
import { mapActions } from "vuex";
export default {
    name: "DeviceOrientationChecking",
    data: () => ({
        showWarning: false
    }),
    mounted() {
        this.$nextTick(() => {
            setInterval(this.chechDevice, 1000);
        });
    },
    methods: {
        ...mapActions("User", ["closeModal"]),
        chechDevice() {
            if (
                Device.checkIfTouchDevice() &&
                Device.isMobileDevice() != null &&
                Device.checkOrientation() == false
            ) {
                if (!this.showWarning) {
                    this.showWarning = true;
                }
            } else {
                if (this.showWarning) {
                    this.showWarning = false;
                }
            }
            this.overflowCheck();
        },
        overflowCheck() {
            const hasOverflow = getComputedStyle(
                document.querySelector("#vrBody")
            ).overflow;
            document.getElementById("vrBody").classList.add("font-arial");
            if (Device.isMobileDevice() != null && Device.checkOrientation() && this.$route.name === "userAuthentication") {
                if (hasOverflow === "hidden") {
                    document
                        .getElementById("vrBody")
                        .classList.remove("overflow-hidden");
                    document.getElementById("vrBody").classList.add("overflow-y-scroll");
                }
            } else {
                if (hasOverflow === "auto scroll" || hasOverflow === "visible") {
                    document.getElementById("vrBody").classList.add("overflow-hidden");
                    document.getElementById("vrBody").classList.remove("overflow-y-scroll");
                }
            }
        },
    },
};
</script>
