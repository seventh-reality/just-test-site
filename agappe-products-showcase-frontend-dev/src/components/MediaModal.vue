<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="fixed z-10 inset-0 overflow-hidden"
    aria-labelledby="media-modal"
    role="dialog"
    aria-modal="true"
    v-if="getModalData.isOpen"
  >
    <div
      class="
        flex
        items-end
        justify-center
        min-h-screen
        p-2
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
        class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
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
      <div
        class="
          inline-block
          align-bottom
          bg-white
          rounded-lg
          text-left
          overflow-hidden
          shadow-xl
          transform
          transition-all
          m-4
          sm:align-middle
        "
      >
        <div class="bg-white p-2">
          <div class="sm:flex sm:items-start">
            <div class="text-left">
              <h3
                :class="[
                  runningOnMobile ? 'text-xs' : 'text-lg',
                  'leading-6 font-medium text-gray-900',
                ]"
                id="modal-title"
              >
                {{ getModalData.name }}
              </h3>
              <div
                :class="[
                  widthWithinRange
                    ? heightWithinRange
                      ? 'h-48'
                      : 'h-80'
                    : heightWithinRange
                    ? 'h-40'
                    : 'h-96',
                  'my-3 max-w-2xl mx-auto text-center',
                ]"
                v-if="getModalData.type === 'text'"
              >
                <p class="text-5xl text-gray-500" style="line-height: 2">
                  {{ getModalData.content }}
                </p>
              </div>
              <div
                :class="[
                  widthWithinRange
                    ? heightWithinRange
                      ? 'h-48'
                      : 'h-80'
                    : heightWithinRange
                    ? 'h-40'
                    : 'h-96',
                  'my-3 max-w-2xl mx-auto',
                ]"
                v-if="getModalData.type === 'image'"
              >
                <img
                  class="h-full w-full rounded"
                  :src="getModalData.url"
                  alt="hotspot_image"
                />
              </div>
              <div
                :class="[
                  widthWithinRange
                    ? heightWithinRange
                      ? 'h-48'
                      : 'h-80'
                    : heightWithinRange
                    ? 'h-40'
                    : 'h-96',
                  'my-3 max-w-2xl mx-auto',
                ]"
                v-else-if="getModalData.type === 'video'"
              >
                <video
                  id="modalVideo"
                  playsinline
                  autoplay
                  muted
                  crossorigin
                  class="h-full w-full rounded"
                >
                  <source src="" type="video/mp4" />
                  Your browser does not support HTML video.
                </video>
              </div>
            </div>
            <div
              class="
                absolute
                top-2
                right-2
                flex
                space-x-4
                cursor-pointer
                transform
                rotate-45
              "
              @click="performModalClose()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Device } from "../helpers/device";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "AlertModal",
    data: () => ({
        runningOnMobile: false,
        heightWithinRange: false,
        widthWithinRange: false,
    }),
    mounted() {
        this.$nextTick(() => {
            window.addEventListener(
                "resize",
                () => {
                    this.getHeightWidth();
                    this.checkDevice();
                }
            );
        });
    },
    computed: {
        ...mapGetters("User", ["getModalData", "getFSStatus"]),
        ...mapGetters("Product", ["getPlayerStatus"]),
        
    },
    methods: {
        ...mapActions("User", ["closeModal", "toggleFSMode"]),
        getHeightWidth() {
            this.widthWithinRange = window.innerWidth >= 600 && window.innerWidth < 800;
            this.heightWithinRange = window.innerHeight >= 280 && window.innerHeight < 600;
        },
        checkDevice() {
            if (Device.isMobileDevice() != null) {
                this.runningOnMobile = true;
            } else {
                this.runningOnMobile = false;
            }
        },
        performModalClose() {
            this.closeModal();
            if (Device.isMobileDevice() != null && !document.fullscreenElement) {
                this.doFullScreen();
            }
        },
        doFullScreen() {
            if (!this.getFSStatus) {
                this.toggleFSMode(true);
                if (!document.fullscreenElement) {
                    document
                        .querySelector("#vrBody")
                        .requestFullscreen({
                            navigationUI: "hide",
                        })
                        .catch((err) => {
                            console.log(
                                `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
                            );
                        });
                    // @ts-ignore
                } else if (document.querySelector("#vrBody").webkitRequestFullscreen) {
                    /* Safari */
                    // @ts-ignore
                    document.querySelector("#vrBody").webkitRequestFullscreen();
                    // @ts-ignore
                } else if (document.querySelector("#vrBody").msRequestFullscreen) {
                    /* IE11 */
                    // @ts-ignore
                    document.querySelector("#vrBody").msRequestFullscreen();
                }
            }
        },
    },
};
</script>
