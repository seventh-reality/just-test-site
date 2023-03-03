<template>
  <div class="bg-black opacity-100">
    <div v-show="loadPlayer" class="overflow-hidden relative">
      <canvas
        id="renderCanvas"
        touch-action="none"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
      <div
        class="
          absolute
          top-6
          left-4
          flex
          space-x-4
          cursor-pointer
          rounded
          shadow-xl
          justify-center
          items-center
          bg-gray-300
          h-8
          w-8
        "
        @click="loadPlayer = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          preserveAspectRatio="xMidYMid meet"
          class="h-8 w-8 text-black"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <div
        class="
          absolute
          top-6
          left-16
          flex
          space-x-4
          cursor-pointer
          border-1
          rounded
          border-black
          shadow-xl
          justify-center
          items-center
          bg-gray-300
          h-8
          w-8
        "
        v-show="showFullScreenButton"
        @click="toggleFullScreen(!getFSStatus)"
      >
        <img src="/images/fullscreen.jpg" alt="fullscreen" />
      </div>
      <div
        :class="[
          showFullScreenButton ? 'left-28' : 'left-16',
          'top-6 absolute flex',
        ]"
        v-if="showDisclaimer"
      >
        <!-- <img
            src="https://d1tjuuvd88uqh8.cloudfront.net/resources/common/disclaimer.png"
            alt="disclaimer"
            :class="[
              scale < 0.75
                ? 'h-10 w-40'
                : scale >= 0.75 && scale < 1
                ? 'h-12 w-48'
                : scale >= 1 && scale < 1.25
                ? 'h-14 w-56'
                : scale >= 1.25 && scale < 1.5
                ? 'h-16 w-64'
                : 'h-18 w-72',
              'my-1 py-1 z-20 animate-pulse',
            ]"
          /> -->
        <span>Available only in India</span>
      </div>
      <div
        class="
          absolute
          top-4
          right-4
          flex flex-col
          justify-center
          items-end
          text-right
          py-2
        "
        v-if="storyBoardItem == 'features'"
      >
        <div v-for="(media, index) in getSelectedProduct.media" :key="index">
          <img
            v-if="
              media.hpImageName &&
              media.meta_data.hotspot_environment == '2D' &&
              show2DSpots
            "
            :src="
              'https://d1tjuuvd88uqh8.cloudfront.net/resources/' +
              getSelectedProduct.id +
              '/hotspots/image/' +
              media.hpImageName +
              '.png'
            "
            :alt="media.hpImageName"
            :class="[
              scale < 0.75
                ? 'h-10 w-30'
                : scale >= 0.75 && scale < 1
                ? 'h-12 w-36'
                : scale >= 1 && scale < 1.25
                ? 'h-14 w-42'
                : scale >= 1.25 && scale < 1.5
                ? 'h-16 w-48'
                : 'h-18 w-54',
              'my-1 py-1 z-20 cursor-pointer',
            ]"
            @click="prepareMediaModal(media)"
          />
        </div>
      </div>

      <div
        class="
          flex flex-row
          absolute
          bottom-0
          w-full
          justify-center
          content-center
          p-2
          items-center
        "
      >
        <img
          v-if="toggleStoryBoard"
          :class="[
            storyBoardItem == 'nomenclature' ? 'z-50' : 'z-40',
            scale < 0.75 ? 'h-10' : 'h-14',
            '-mr-6',
          ]"
          @click="storyBoardItem = 'nomenclature'"
          :src="
            storyBoardItem == 'nomenclature'
              ? 'https://d1tjuuvd88uqh8.cloudfront.net/resources/common/nomenclature_active.png'
              : 'https://d1tjuuvd88uqh8.cloudfront.net/resources/common/nomenclature_inactive.png'
          "
          alt="nomenclature"
        />
        <img
          v-if="toggleStoryBoard"
          :class="[
            storyBoardItem == 'features' ? 'z-50' : 'z-40',
            scale < 0.75 ? 'h-10' : 'h-14',
            '-ml-6',
          ]"
          @click="storyBoardItem = 'features'"
          :src="
            storyBoardItem == 'features'
              ? 'https://d1tjuuvd88uqh8.cloudfront.net/resources/common/features_active.png'
              : 'https://d1tjuuvd88uqh8.cloudfront.net/resources/common/features_inactive.png'
          "
          alt="features"
        />
        <img
          v-if="toggleStoryBoard"
          :class="[scale < 0.75 ? 'h-10' : 'h-14', 'z-50']"
          @click="resetStoryBoard()"
          src="https://d1tjuuvd88uqh8.cloudfront.net/resources/common/reset.png"
          alt="hotspot"
        />
        <div
          v-if="storyBoardItem == 'features' && onScreenText != ''"
          :class="[
            checkDevice ? 'text-xs' : 'text-sm',
            'font-medium bg-gray-600 rounded-lg p-1 text-center justify-center items-center flex border-white border-solid border-2 text-white z-50',
          ]"
          style="width: 100%"
        >
          <p>{{ onScreenText }}</p>
        </div>
        <audio
          v-if="storyBoardItem == 'features' && voiceover != ''"
          crossorigin
          autoplay
          class="hidden"
          @ended="clearOSTVO()"
          id="storyBoardAudio"
        >
          <source src="" type="audio/mpeg" />
          Your browser does not support HTML <code>audio</code>.
        </audio>
      </div>
    </div>
    <div v-show="!loadPlayer" class="overflow-hidden relative">
      <canvas
        id="panoramaCanvas"
        touch-action="none"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mousewheel="handleMouseWheel"
        @touchstart="handleMouseDown"
        @touchmove="handleMouseMove"
        @touchend="handleMouseUp"
      >
      </canvas>
      <div
        class="
          absolute
          top-4
          left-4
          flex
          space-x-4
          cursor-pointer
          border-1
          rounded
          border-black
          shadow-xl
          justify-center
          items-center
          bg-gray-300
          h-8
          w-8
        "
        v-show="showFullScreenButton"
        @click="toggleFullScreen(!getFSStatus)"
      >
        <img src="/images/fullscreen.jpg" alt="fullscreen" />
      </div>
      <div
        :class="[
          canvasMoved ? 'visible' : 'hidden',
          'animate-pulse absolute flex space-x-4 cursor-pointer rounded-full',
        ]"
        :style="{
          left:
            leftSpacing +
            (infoIconPos[index] && infoIconPos[index].left) +
            movableX +
            'px',
          top:
            topSpacing +
            (infoIconPos[index] && infoIconPos[index].top) +
            movableY +
            'px',
        }"
        v-for="(product, index) in getAvailableProducts"
        :key="product.id"
        @click="selectThisProduct(product)"
      >
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            scale < 1
              ? 'h-6 w-6'
              : scale >= 1 && scale < 1.25
              ? 'h-8 w-8'
              : scale >= 1.25 && scale < 1.5
              ? 'h-10 w-10'
              : 'h-12 w-12',
            'text-black',
          ]"
          viewBox="0 0 40.000000 40.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,40.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path
              d="M122 329 c-23 -11 -52 -35 -63 -51 -38 -53 -38 -158 1 -208 29 -38 35 -17 10 35 -51 106 15 215 131 215 119 0 190 -137 119 -232 -22 -30 -21 -44 3 -35 42 16 61 140 30 204 -37 79 -149 114 -231 72z"
            />
            <path
              d="M142 283 c-38 -19 -64 -62 -64 -108 0 -35 27 -95 42 -95 14 0 12 22 -5 44 -44 58 8 146 85 146 77 0 129 -88 85 -146 -17 -22 -19 -44 -5 -44 15 0 42 60 42 95 0 47 -26 90 -66 109 -43 20 -72 20 -114 -1z"
            />
            <path
              d="M152 230 c-32 -30 -29 -110 4 -110 16 0 19 16 4 25 -14 9 -13 48 2 63 15 15 61 15 76 0 15 -15 16 -54 2 -63 -15 -9 -12 -25 4 -25 17 0 26 22 26 60 0 36 -34 70 -70 70 -14 0 -36 -9 -48 -20z"
            />
            <path
              d="M183 184 c-9 -23 13 -40 32 -24 12 10 13 16 4 26 -15 18 -28 18 -36 -2z"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// @ts-ignore
import { debounce } from "lodash";
// @ts-ignore
import { createScene } from "@/babylon/sceneManager";
import { Device } from "../helpers/device";
export default {
    name: "ProductShowroom",
    data: () => ({
        canvas: null,
        ctx: null,
        canvasOffset: null,
        offsetX: null,
        offsetY: null,
        lastX: 0,
        lastY: 0,
        panX: 0,
        panY: -100,
        isDown: false,
        images: [],
        canvasImage: null,
        rightBoundary: 0,
        bottomBoundary: 0,
        movableX: 0,
        movableY: 0,
        canvasHeight: 0,
        canvasWidth: 0,
        topSpacing: 0,
        leftSpacing: 0,
        scale: 1,
        startScale: false,
        infoIconPos: [],
        storyBoardItem: "",
        toggelHotspots: false,
        voiceover: "",
        onScreenText: "",
        loadPlayer: false,
        WebGL: null,
        loadComplete: false,
        canvasMoved: false,
        show2DSpots: true,
        showFullScreenButton: false,
        playingAnimation: false,
        resetOnVoiceOver: false,
    }),
    computed: {
        ...mapGetters("Product", ["getSelectedProduct", "getAvailableProducts"]),
        ...mapGetters("User", ["getUserInfo", "getLoaderData", "getModalData", "getFSStatus", "getWTOtatus"]),
        toggleStoryBoard() {
            if (this.playingAnimation) {
                return false;
            } else {
                if (this.getModalData.isOpen) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        showDisclaimer() {
            return ["mispa_magenta", "mispa_lume"].includes(
                this.getSelectedProduct.value
            );
        },
        checkDevice() {
            if (Device.isMobileDevice() != null) {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (this.getUserInfo.loggedInTime) {
                const sessionTimeout = 1 * 24 * 3600 * 1000; // 1 Day = 86400000 micro seconds
                if (Date.now() - this.getUserInfo.loggedInTime > sessionTimeout) {
                    this.logout();
                }
            }
            // if (Device.isMobileDevice != null) {
            //     let lodingInterval = setInterval(() => {
            //         if(Device.checkOrientation) {
            //             if (document.getElementById("panoramaCanvas")) {
            //                 this.onResize();
            //                 clearInterval(lodingInterval);
            //             }
            //         }
            //     }, 1000);
            // } else {
            this.onResize();
            // }
            if (this.getAvailableProducts.length == 0) {
                this.startLoading({
                    type: "info",
                    size:
            this.predefinedScale() >= 1
                ? "lg"
                : this.predefinedScale() >= 1.25
                    ? "xl"
                    : "md",
                });
                this.getProductList().then(() => {
                    if (this.loadComplete) {
                        this.stopLoading();
                    } else {
                        this.loadComplete = true;
                    }
                });
            }

            this.WebGL = new createScene("renderCanvas");
            window.addEventListener(
                "resize",
                debounce(this.onResize, 1000, { maxWait: 1500 })
            );
            window["eTriggerContent"] = (event) => this.prepareMediaModal(event);
            // eslint-disable-next-line no-unused-vars
            window["eSetLoader"] = (loading) => {
                loading
                    ? this.startLoading({
                        type: "info",
                        size:
                this.predefinedScale() >= 1
                    ? "lg"
                    : this.predefinedScale() >= 1.25
                        ? "xl"
                        : "md",
                    })
                    : this.stopLoading();
            };
            if (this.getUserInfo.loggedIn && this.getSelectedProduct.value) {
                this.loadPlayer = true;
                this.WebGL.loadModel(this.getSelectedProduct);
            } else {
                // Displaying information screen
                this.openModal({
                    isOpen: true,
                    content: null,
                    type: "image",
                    url: "https://d1tjuuvd88uqh8.cloudfront.net/resources/common/info_screen.png",
                    name: "",
                });
            }

            if (Device.isMobileDevice() != null) {
                if (!this.showFullScreenButton) {
                    this.showFullScreenButton = true;
                }
            } else {
                if (this.showFullScreenButton) {
                    this.showFullScreenButton = false;
                }
            }

            // eslint-disable-next-line no-unused-vars
            document.addEventListener("visibilitychange", (event) => {
                if (document.visibilityState !== "visible") {
                    this.openModal({
                        isOpen: false,
                        content: null,
                        type: "",
                        url: "",
                        name: "",
                    });
                    this.WebGL.webglResetAnimations();
                }
            });
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    watch: {
    // eslint-disable-next-line no-unused-vars
        toggelHotspots(nV, oV) {
            if (nV) {
                this.WebGL.webglShow3DIcons();
                this.show2DSpots = true;
            } else {
                this.WebGL.webglHide3DIcons();
                this.show2DSpots = false;
            }
        },
        // eslint-disable-next-line no-unused-vars
        loadPlayer(nV, oV) {
            this.makePlayerVisible(nV);
            if (!nV) {
                this.resetSelectedProduct();
                this.resetStoryBoard();
            }
        },
        // eslint-disable-next-line no-unused-vars
        storyBoardItem(nV, oV) {
            if (nV == "nomenclature") {
                this.onScreenText = "";
                this.voiceover = "";
                this.toggelHotspots = false;
                this.WebGL.webglShow3DTags();
            } else if (nV == "features") {
                this.toggelHotspots = true;
                this.WebGL.webglHide3DTags();
            }
        },
        "getModalData.isOpen": {
            // eslint-disable-next-line no-unused-vars
            handler: function (nV, oV) {
                if (!nV) {
                    this.toggleSpotAndRotation(true);
                    this.clearOSTVO();
                }
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions("Product", [
            "getProductList",
            "selectedProduct",
            "resetSelectedProduct",
            "makePlayerVisible",
        ]),
        ...mapActions("User", [
            "startLoading",
            "stopLoading",
            "openModal",
            "logout",
            "toggleFSMode",
            "setWatchingTimeOver"
        ]),
        toggleFullScreen(element) {
            this.toggleFSMode(element);
            if (element) {
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
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch((err) => console.error(err));
                    // @ts-ignore
                } else if (document.webkitExitFullscreen) {
                    /* Safari */
                    // @ts-ignore
                    document.webkitExitFullscreen();
                    // @ts-ignore
                } else if (document.msExitFullscreen) {
                    /* IE11 */
                    // @ts-ignore
                    document.msExitFullscreen();
                }
            }
        },
        selectThisProduct(payload) {
            if (this.getSelectedProduct.value != payload.value) {
                this.selectedProduct(payload);
            }
            this.loadPlayer = true;
            // Try To Use Same Function To Load Model, need Clear up
            this.WebGL.loadModel(payload);
            if (!this.getUserInfo.loggedIn) {
                if (this.getWTOtatus) {
                    this.$router.push({ name: "userAuthentication" });
                } else {
                    let count = 0;
                    let watchingTime = setInterval(()=>{
                        if (++count >= 15) {
                            this.setWatchingTimeOver(true);
                            clearInterval(watchingTime);
                            this.$router.push({ name: "userAuthentication" });
                        }
                    }, 1000);
                }
            }
        },
        // eslint-disable-next-line no-unused-vars
        prepareMediaModal(event) {
            this.toggleSpotAndRotation(false);
            // setting new onScreenText & voiceover
            this.onScreenText = event.meta_data.onScreenText ?? "";
            this.voiceover = event.meta_data.voiceover ?? "";
            setTimeout(() => {
                let audio = document.querySelector("#storyBoardAudio");
                let source = audio.children[0];
                source.setAttribute("src", this.voiceover);
                // @ts-ignore
                audio.load();
                // @ts-ignore
                audio.play().catch((err) => {
                    console.log(
                        `Error attempting to play audio: ${err.message} (${err.name})`
                    );
                });
            }, 1000);
            if (event.type !== "animation") {
                this.openModal({
                    isOpen: true,
                    content: null,
                    type: event.type,
                    url: event.path,
                    name: event.name,
                });
                if (event.type == "video") {
                    setTimeout(() => {
                        let video = document.querySelector("#modalVideo");
                        let source = video.children[0];
                        source.setAttribute("src", event.path);
                        // @ts-ignore
                        video.load();
                        // @ts-ignore
                        video.play().catch((err) => {
                            console.log(
                                `Error attempting to play video: ${err.message} (${err.name})`
                            );
                        });
                    }, 1000);
                }
            } else {
                this.playingAnimation = true;
            }
        },
        toggleSpotAndRotation(preparingMediaModal) {
            if (preparingMediaModal) {
                this.toggelHotspots = true;
                this.WebGL.webglEnableAutoRotation();
            } else {
                this.toggelHotspots = false;
                this.WebGL.webglDisableAutoRotation();
            }
        },
        // eslint-disable-next-line no-unused-vars
        clearOSTVO(event) {
            if (this.playingAnimation) {
                this.playingAnimation = false;
                this.toggleSpotAndRotation(true);
            }
            this.onScreenText = "";
            this.voiceover = "";
        },
        resetStoryBoard() {
            this.clearOSTVO();
            this.toggelHotspots = false;
            this.WebGL.webglHide3DTags();
            this.storyBoardItem = "";
            this.openModal({
                isOpen: false,
                content: null,
                type: "",
                url: "",
                name: "",
            });
            this.WebGL.webglResetAnimations();
        },
        onResize() {
            this.predefinedPosition();
            this.canvasHeight = window.innerHeight - 65;
            this.canvasWidth = window.innerWidth;
            this.startScale = true;
            this.scale = this.predefinedScale();
            if (this.scale == this.predefinedScale()) {
                this.movableY = 0;
                this.movableX = 0;
            }
            if (!this.loadPlayer) {
                this.loadInCanvas();
            }
        },
        loadInCanvas() {
            this.canvas = document.getElementById("panoramaCanvas");
            this.ctx = this.canvas.getContext("2d", { alpha: false });
            this.canvasOffset = {
                left:
          window.innerWidth - this.canvas.offsetLeft - this.canvas.offsetWidth,
                top:
          window.innerHeight - this.canvas.offsetTop - this.canvas.offsetHeight,
            };
            this.offsetX = this.canvasOffset.left;
            this.offsetY = this.canvasOffset.top;
            this.canvasImage = new Image();
            this.canvasImage.onload = () => {
                this.draw();
            };
            this.canvasImage.src =
        "https://d1tjuuvd88uqh8.cloudfront.net/resources/common/landing.jpg";
        },
        scaleHotspotSpacing(sf) {
            // Todo
            this.leftSpacing += 3.75 * this.scale * sf;
            this.topSpacing += 2.5 * this.scale * sf;
        },
        predefinedPosition() {
            // console.log(`Width x Height: ${window.innerWidth} x ${window.innerHeight}`);
            if (window.innerWidth >= 2560) {
                this.rightBoundary = -6055;
                this.panX = -2690;
                this.bottomBoundary = -125;
                if (window.innerHeight >= 1440) {
                    this.panY = 0;
                    this.infoIconPos = [
                        {
                            top: 550,
                            left: 0,
                        },
                        {
                            top: 500,
                            left: 725,
                        },
                        {
                            top: 590,
                            left: 2010,
                        },
                        {
                            top: 550,
                            left: 6940,
                        },
                        {
                            top: 660,
                            left: 8000,
                        },
                        {
                            top: 600,
                            left: 8710,
                        },
                        {
                            top: 440,
                            left: 10050,
                        },
                    ];
                    this.leftSpacing = 820;
                    this.topSpacing = 95;
                } else if (window.innerHeight >= 864) {
                    this.rightBoundary = -5735;
                    this.panY = -125;
                    this.infoIconPos = [
                        {
                            top: 370,
                            left: 0,
                        },
                        {
                            top: 350,
                            left: 630,
                        },
                        {
                            top: 420,
                            left: 1690,
                        },
                        {
                            top: 400,
                            left: 5770,
                        },
                        {
                            top: 480,
                            left: 6670,
                        },
                        {
                            top: 420,
                            left: 7275,
                        },
                        {
                            top: 300,
                            left: 8375,
                        },
                    ];
                    this.leftSpacing = 670;
                    this.topSpacing = 0;
                }
            } else if (window.innerWidth >= 1920) {
                this.rightBoundary = -6355;
                this.bottomBoundary = -125;
                this.panX = -2835;
                this.infoIconPos = [
                    {
                        top: 330,
                        left: 0,
                    },
                    {
                        top: 295,
                        left: 600,
                    },
                    {
                        top: 376,
                        left: 1680,
                    },
                    {
                        top: 330,
                        left: 5780,
                    },
                    {
                        top: 430,
                        left: 6670,
                    },
                    {
                        top: 370,
                        left: 7265,
                    },
                    {
                        top: 245,
                        left: 8370,
                    },
                ];
                this.leftSpacing = 680;
                this.topSpacing = 95;
            } else if (window.innerWidth >= 1600) {
                this.rightBoundary = -6200;
                this.bottomBoundary = -125;
                this.panY = -125;
                this.panX = -2765;
                this.infoIconPos = [
                    {
                        top: 300,
                        left: 0,
                    },
                    {
                        top: 280,
                        left: 485,
                    },
                    {
                        top: 330,
                        left: 1345,
                    },
                    {
                        top: 315,
                        left: 4615,
                    },
                    {
                        top: 400,
                        left: 5330,
                    },
                    {
                        top: 350,
                        left: 5810,
                    },
                    {
                        top: 245,
                        left: 6700,
                    },
                ];
                this.leftSpacing = 540;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 1536) {
                this.rightBoundary = -5800;
                this.bottomBoundary = -125;
                this.panY = -70;
                this.panX = -2610;
                this.infoIconPos = [
                    {
                        top: 270,
                        left: 0,
                    },
                    {
                        top: 235,
                        left: 360,
                    },
                    {
                        top: 300,
                        left: 1010,
                    },
                    {
                        top: 255,
                        left: 3465,
                    },
                    {
                        top: 335,
                        left: 3995,
                    },
                    {
                        top: 300,
                        left: 4360,
                    },
                    {
                        top: 220,
                        left: 5025,
                    },
                ];
                this.leftSpacing = 405;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 1440) {
                this.rightBoundary = -6355;
                this.bottomBoundary = -125;
                this.panY = -70;
                this.panX = -2920;
                this.infoIconPos = [
                    {
                        top: 330,
                        left: 0,
                    },
                    {
                        top: 300,
                        left: 480,
                    },
                    {
                        top: 390,
                        left: 1350,
                    },
                    {
                        top: 325,
                        left: 4625,
                    },
                    {
                        top: 430,
                        left: 5335,
                    },
                    {
                        top: 375,
                        left: 5815,
                    },
                    {
                        top: 275,
                        left: 6705,
                    },
                ];
                this.leftSpacing = 535;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 1366) {
                this.rightBoundary = -6090;
                this.bottomBoundary = -125;
                this.panY = -125;
                this.panX = -2740;
                this.infoIconPos = [
                    {
                        top: 250,
                        left: 0,
                    },
                    {
                        top: 210,
                        left: 390,
                    },
                    {
                        top: 260,
                        left: 1080,
                    },
                    {
                        top: 240,
                        left: 3700,
                    },
                    {
                        top: 315,
                        left: 4270,
                    },
                    {
                        top: 265,
                        left: 4655,
                    },
                    {
                        top: 190,
                        left: 5365,
                    },
                ];
                this.leftSpacing = 430;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 1280) {
                this.rightBoundary = -6095;
                this.bottomBoundary = -125;
                this.panY = -120;
                this.panX = -2740;
                this.infoIconPos = [
                    {
                        top: 220,
                        left: 0,
                    },
                    {
                        top: 180,
                        left: 370,
                    },
                    {
                        top: 230,
                        left: 1005,
                    },
                    {
                        top: 210,
                        left: 3460,
                    },
                    {
                        top: 285,
                        left: 4000,
                    },
                    {
                        top: 235,
                        left: 4355,
                    },
                    {
                        top: 170,
                        left: 5025,
                    },
                ];
                this.leftSpacing = 405;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 1024) {
                this.rightBoundary = -6425;
                this.bottomBoundary = -125;
                this.panY = -50;
                this.panX = -2930;
                this.infoIconPos = [
                    {
                        top: 260,
                        left: 0,
                    },
                    {
                        top: 220,
                        left: 355,
                    },
                    {
                        top: 290,
                        left: 1010,
                    },
                    {
                        top: 260,
                        left: 3465,
                    },
                    {
                        top: 325,
                        left: 4000,
                    },
                    {
                        top: 285,
                        left: 4360,
                    },
                    {
                        top: 220,
                        left: 5025,
                    },
                ];
                this.leftSpacing = 405;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 960) {
                this.rightBoundary = -6385;
                this.bottomBoundary = -125;
                this.panY = -125;
                this.panX = -2930;
                this.infoIconPos = [
                    {
                        top: 200,
                        left: 0,
                    },
                    {
                        top: 180,
                        left: 320,
                    },
                    {
                        top: 220,
                        left: 875,
                    },
                    {
                        top: 180,
                        left: 3000,
                    },
                    {
                        top: 245,
                        left: 3465,
                    },
                    {
                        top: 205,
                        left: 3775,
                    },
                    {
                        top: 140,
                        left: 4355,
                    },
                ];
                this.leftSpacing = 350;
                this.topSpacing = 0;
            } else if (window.innerWidth >= 800) {
                this.rightBoundary = -6400;
                this.bottomBoundary = -120;
                this.panX = -3015;
                this.panY = -100;
                this.infoIconPos = [
                    {
                        top: 200,
                        left: 0,
                    },
                    {
                        top: 180,
                        left: 320,
                    },
                    {
                        top: 220,
                        left: 875,
                    },
                    {
                        top: 180,
                        left: 3000,
                    },
                    {
                        top: 245,
                        left: 3465,
                    },
                    {
                        top: 205,
                        left: 3775,
                    },
                    {
                        top: 140,
                        left: 4355,
                    },
                ];
                this.leftSpacing = 350;
                this.topSpacing = 0;
                if (window.innerHeight >= 480 && window.innerHeight < 600) {
                    this.panY = 0;
                    this.panX = -2800;
                    this.rightBoundary = -6100;
                    this.infoIconPos = [
                        {
                            top: 175,
                            left: 0,
                        },
                        {
                            top: 165,
                            left: 225,
                        },
                        {
                            top: 200,
                            left: 645,
                        },
                        {
                            top: 185,
                            left: 2215,
                        },
                        {
                            top: 215,
                            left: 2555,
                        },
                        {
                            top: 195,
                            left: 2790,
                        },
                        {
                            top: 165,
                            left: 3210,
                        },
                    ];
                    this.leftSpacing = 256;
                }
                if (window.innerHeight >= 360 && window.innerHeight < 480) {
                    this.panY = -15;
                    this.panX = -2500;
                    this.rightBoundary = -5500;
                    this.infoIconPos = [
                        {
                            top: 140,
                            left: 0,
                        },
                        {
                            top: 130,
                            left: 175,
                        },
                        {
                            top: 150,
                            left: 480,
                        },
                        {
                            top: 140,
                            left: 1665,
                        },
                        {
                            top: 170,
                            left: 1920,
                        },
                        {
                            top: 145,
                            left: 2090,
                        },
                        {
                            top: 115,
                            left: 2410,
                        },
                    ];
                    this.leftSpacing = 190;
                }
                if (window.innerHeight >= 280 && window.innerHeight < 360) {
                    this.panY = 0;
                    this.panX = -2300;
                    this.rightBoundary = -5400;
                    this.infoIconPos = [
                        {
                            top: 105,
                            left: 0,
                        },
                        {
                            top: 100,
                            left: 165,
                        },
                        {
                            top: 130,
                            left: 445,
                        },
                        {
                            top: 130,
                            left: 1525,
                        },
                        {
                            top: 155,
                            left: 1765,
                        },
                        {
                            top: 130,
                            left: 1920,
                        },
                        {
                            top: 105,
                            left: 2210,
                        },
                    ];
                    this.leftSpacing = 170;
                }
            } else if (window.innerWidth >= 600) {
                this.rightBoundary = -6195;
                this.bottomBoundary = -125;
                this.panY = -110;
                this.panX = -2775;
                this.infoIconPos = [
                    {
                        top: 110,
                        left: 0,
                    },
                    {
                        top: 90,
                        left: 190,
                    },
                    {
                        top: 130,
                        left: 530,
                    },
                    {
                        top: 100,
                        left: 1845,
                    },
                    {
                        top: 135,
                        left: 2130,
                    },
                    {
                        top: 125,
                        left: 2320,
                    },
                    {
                        top: 75,
                        left: 2675,
                    },
                ];
                this.leftSpacing = 215;
                this.topSpacing = 0;
                if (window.innerHeight >= 480 && window.innerHeight < 600) {
                    this.panY = 0;
                    this.infoIconPos = [
                        {
                            top: 140,
                            left: 0,
                        },
                        {
                            top: 130,
                            left: 195,
                        },
                        {
                            top: 170,
                            left: 550,
                        },
                        {
                            top: 140,
                            left: 1895,
                        },
                        {
                            top: 185,
                            left: 2185,
                        },
                        {
                            top: 165,
                            left: 2390,
                        },
                        {
                            top: 125,
                            left: 2745,
                        },
                    ];
                }
                if (window.innerHeight >= 360 && window.innerHeight < 480) {
                    this.panY = -15;
                    this.rightBoundary = -5800;
                    this.infoIconPos = [
                        {
                            top: 140,
                            left: 0,
                        },
                        {
                            top: 130,
                            left: 175,
                        },
                        {
                            top: 150,
                            left: 480,
                        },
                        {
                            top: 140,
                            left: 1665,
                        },
                        {
                            top: 170,
                            left: 1920,
                        },
                        {
                            top: 145,
                            left: 2090,
                        },
                        {
                            top: 115,
                            left: 2410,
                        },
                    ];
                    this.leftSpacing = 190;
                }
                if (window.innerHeight >= 280 && window.innerHeight < 360) {
                    this.panY = 0;
                    this.rightBoundary = -5400;
                    this.infoIconPos = [
                        {
                            top: 105,
                            left: 0,
                        },
                        {
                            top: 100,
                            left: 145,
                        },
                        {
                            top: 110,
                            left: 380,
                        },
                        {
                            top: 110,
                            left: 1295,
                        },
                        {
                            top: 125,
                            left: 1495,
                        },
                        {
                            top: 120,
                            left: 1630,
                        },
                        {
                            top: 85,
                            left: 1880,
                        },
                    ];
                    this.leftSpacing = 140;
                }
            }
        },
        predefinedScale() {
            if (window.innerWidth >= 2560) {
                if (window.innerHeight >= 1440) {
                    return 1.5;
                } else if (window.innerHeight >= 864) {
                    return 1.25;
                }
            }
            if (window.innerWidth >= 1920) {
                return 1.25;
            }
            if (window.innerWidth >= 1600) {
                return 1;
            }
            if (window.innerWidth >= 1536) {
                return 0.75;
            }
            if (window.innerWidth >= 1440) {
                return 1;
            }
            if (window.innerWidth >= 1366) {
                return 0.8;
            }
            if (window.innerWidth >= 1024 && window.innerWidth < 1366) {
                return 0.75;
            }
            if (window.innerWidth >= 800 && window.innerWidth < 1024) {
                if (window.innerHeight >= 480 && window.innerHeight < 600) {
                    return 0.48;
                }
                if (window.innerHeight >= 360 && window.innerHeight < 480) {
                    return 0.36;
                }
                if (window.innerHeight >= 280 && window.innerHeight < 360) {
                    return 0.33;
                }
                return 0.65;
            }
            if (window.innerWidth >= 600 && window.innerWidth < 800) {
                if (window.innerHeight >= 280 && window.innerHeight < 360) {
                    return 0.28;
                }
                if (window.innerHeight >= 360 && window.innerHeight < 480) {
                    return 0.36;
                }
                if (window.innerHeight >= 480) {
                    return 0.41;
                }
            }
        },
        handleMouseDown(event) {
            if (event.type == "touchstart") {
                if (event.touches && event.touches.length) {
                    // @ts-ignore
                    this.lastX = parseInt(event.touches[0].clientX - this.offsetX);
                    // @ts-ignore
                    this.lastY = parseInt(event.touches[0].clientY - this.offsetY);
                }
            } else if (event.type == "mousedown") {
                // @ts-ignore
                this.lastX = parseInt(event.clientX - this.offsetX);
                // @ts-ignore
                this.lastY = parseInt(event.clientY - this.offsetY);
            }
            this.isDown = true;
        },
        handleMouseUp() {
            this.isDown = false;
        },
        handleMouseMove(event) {
            if (!this.isDown) {
                return;
            }
            if (!this.canvasMoved) {
                this.canvasMoved = true;
            }
            const mouseX =
        event.type == "touchmove"
            ? // @ts-ignore
            parseInt(event.touches[0].clientX - this.offsetX)
            : // @ts-ignore
            parseInt(event.clientX - this.offsetX);
            // const mouseY =
            // event.type == "touchmove"
            // ? // @ts-ignore
            // parseInt(event.touches[0].clientY - this.offsetY)
            // : // @ts-ignore
            // parseInt(event.clientY - this.offsetY);
            const dx = mouseX - this.lastX;
            // const dy = mouseY - this.lastY;
            this.lastX = mouseX;
            // this.lastY = mouseY;
            this.panX += dx;
            // if (this.scale > this.predefinedScale()) {
            //     this.panY += dy;
            // }
            // console.log(event.clientX, this.offsetX, this.lastX, this.panX);
            if (this.panX >= this.rightBoundary && this.panX <= 0) {
                this.movableX = this.panX * this.scale;
                this.startScale = true;
                this.draw();
            } else if (this.panX < this.rightBoundary) {
                this.panX = this.rightBoundary;
            } else if (this.panX > 0) {
                this.panX = 0;
            }
            // if (this.panY >= this.bottomBoundary && this.panY <= 0) {
            //     this.movableY = (this.panY + 100) * this.scale;
            //     this.startScale = true;
            //     this.draw();
            // } else if (this.panY < this.bottomBoundary) {
            //     this.panY = this.bottomBoundary;
            // } else if (this.panY > 0) {
            //     this.panY = 0;
            // }
        },
        // eslint-disable-next-line no-unused-vars
        handleMouseWheel(event) {
            // if (event.deltaY < 0) {
            //     if (this.scale < 1.5) {
            //         this.scale += 0.01;
            //         this.scaleHotspotSpacing(1);
            //     } else {
            //         this.scale = 1.5;
            //     }
            // } else if (event.deltaY > 0) {
            //     if (this.scale > this.predefinedScale()) {
            //         this.scale -= 0.01;
            //         this.scaleHotspotSpacing(-1);
            //     } else {
            //         this.scale = this.predefinedScale();
            //     }
            // }
            // if (this.scale == 1) {
            //     this.bottomBoundary = -100 * this.scale;
            //     // this.rightBoundary = -3250 * this.scale;
            // } else if (this.scale == 1.25 || this.scale == 1.5) {
            //     this.bottomBoundary = -150 * this.scale;
            //     // this.rightBoundary = -2200 * this.scale;
            // }
            // this.startScale = true;
            // this.draw();
        },
        draw() {
            this.ctx.save();
            if (this.startScale) {
                this.ctx.scale(this.scale, this.scale);
                this.startScale = false;
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(
                this.canvasImage,
                Math.floor(this.panX),
                Math.floor(this.panY),
                this.canvasImage.width,
                this.canvasImage.height
            );
            for (const img of this.images) {
                this.ctx.beginPath();
                this.ctx.rect(
                    img.x + this.panX,
                    img.y + this.panY,
                    img.width,
                    img.height
                );
                this.ctx.fillStyle = img.color;
                this.ctx.fill();
                this.ctx.stroke();
            }
            this.ctx.restore();
            if (this.getLoaderData.loading) {
                if (this.loadComplete) {
                    this.stopLoading();
                } else {
                    this.loadComplete = true;
                }
            }
        },
    },
};
</script>
