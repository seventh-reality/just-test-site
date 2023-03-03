// let babylonjs = require('babylonjs');

// import * as BABYLON from 'babylonjs';
import {
    Engine,
    Scene,
    Matrix,
    CubeTexture,
    Tools,
    ColorCurves,
    DefaultRenderingPipeline,
    PhotoDome
} from "babylonjs";

import { performDecryption } from "../helpers/utils";
import { Device } from "../helpers/device";

// import { CameraManager } from './CameraManager';
import { MeshLoader } from "./MeshLoader";
import { Spots } from "./Spots";
import { CameraManager } from "./CameraManager";

// import { ClipPlayer } from "./ClipPlayer";
import { webglCallbacks } from "./webglCallbacks";
// import { Device } from "src/helpers/device";
// import { PhotoDome } from "@babylonjs/core/Helpers/photoDome";
// import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";
export class createScene extends CameraManager {
    constructor(canvasID) {
        super();
        this.instance_ = this;
        this.sactivity = {};
        this.sactivity.Callback = new webglCallbacks();
        this.canvas = document.getElementById(canvasID);
        // @ts-ignore
        this.canvas.setAttribute("touch-action", "none");
        this.spotsData = {};
        // @ts-ignore
        this.engine = new Engine(this.canvas, false, {
            preserveDrawingBuffer: true,
            stencil: true,
        });
        this.engine.enableOfflineSupport = false;
        this.engine.hideLoadingUI();
        // Create our first scene.
        this.scene = new Scene(this.engine);
        this.dome = null;
        this.spotsloader = new Spots(this, this.scene, this.sactivity);
        this.meshloader = new MeshLoader(this, this.scene, this.sactivity);
        this.sceneInitiated = false;
        this.autoRotate = false;
        this.mobile = false;
        if (Device.checkIfTouchDevice() && Device.isMobileDevice() != null) {
            this.mobile = true;
        }

        // console.log("Mobile2", Device.checkIfTouchDevice())
        // console.log("Mobile", Device.isMobileDevice())
        // window["getScene"] = () => {
        //     return this;
        // };

        // this.scene.onKeyboardObservable.add((kbInfo) => {
        //     switch (kbInfo.type) {
        //         case KeyboardEventTypes.KEYDOWN:
        //             // //console.log("KEY DOWN: ", kbInfo.event.key);

        //             break;
        //         case KeyboardEventTypes.KEYUP:
        //             //console.log("KEY UP: ", kbInfo.event.key);
        //             //console.log(this.scene.materials)
        //             break;
        //     }
        // });



    }

    loadModel(data) {

        this.sactivity.Callback.setLoader(true);
        //console.log("MODEL DATA");
        //console.log(data);
        if (this.scene && this.scene.cameras[0] != undefined) {
            // @ts-ignore
            this.webglDisableAutoRotation();

        }
        // //console.log("Scene Loaded ", this.sceneInitiated);
        this.sactivity.triggerOnce = false;
        if (!this.sceneInitiated) {
            Object.keys(this.spotsData).forEach((name) => {
                delete this.spotsData[name];
            });

            Object.keys(data.media).forEach((element) => {
                if (data.media[element].hotspot) {
                    this.spotsData[data.media[element].name] = data.media[element];
                } else {
                    if (data.media[element].type == "3DModel") {
                        this._url = data.media[element].path;
                        this.setting = performDecryption(data.media[element].meta_data);
                        if (this.mobile && this.setting.setup.Rotate) {
                            this.autoRotate = this.setting.setup.Rotate[1];
                        }
                        else if (this.setting.setup.Rotate)
                            this.autoRotate = this.setting.setup.Rotate[0];

                        if (this.setting && this.setting.setup && this.setting.setup.domeData)
                            this.loadDome(this.setting.setup.domeData);
                        else
                            this.loadDome(null);

                    }
                }
            });
            this.initProject();

        }
        else {
            this.sactivity.glbLoaded = false;
            this.sactivity.hdrLoaded = false;
            this.sactivity.spotsLoaded = false;
            this.sactivity.textureLoaded = false;
            this.sactivity.materialLoaded = false;
            // delete previous data
            Object.keys(this.spotsData).forEach((name) => {
                delete this.spotsData[name];
            });
            this.spotsData = {};

            // this.modelChangeManager.changeModel(data);
            Object.keys(data.media).forEach((element) => {
                if (data.media[element].hotspot) {
                    this.spotsData[data.media[element].name] =
                        data.media[element];
                } else {
                    if (data.media[element].type == "3DModel") {
                        this._url = data.media[element].path;
                        this.setting = performDecryption(data.media[element].meta_data);
                        //console.log(this.setting.setup.domeData);
                        if (this.setting && this.setting.setup && this.setting.setup.domeData)
                            this.loadDome(this.setting.setup.domeData);
                        // else
                        //     this.loadDome(null);

                    }
                }
            });
            this.changeCamera(this.setting.setup.view, this.camera);
            this.changeHDR(this.setting.setup.view);
            const meshes = Object.assign({}, this.setting.setup.Geometry);
            this.meshloader.loadMeshes(meshes, this._url, this.setting,this.mobile);
        }
    }

    loadDome(data) {
        if (data == null) {
            this.dome = new PhotoDome(
                "mispai3Dome",
                "https://d1tjuuvd88uqh8.cloudfront.net/resources/6ed71a4e-2e7d-4dd7-8619-c95f5f8f6ff5/textures/360photo4k.jpg",
                {
                    resolution: 32,
                    size: 1000
                },
                this.scene
            );

            this.dome.rotation.set(0, 0, 0);
            this.dome.position.set(0, -12, 0);
            this.dome.scaling.set(1, 1, 1);
        }
        else {

            if (this.dome != null) {
                this.dome.dispose();
            }
            this.dome = new PhotoDome(
                data.name,
                this._url + "textures/" + data.domeImage,
                {
                    resolution: data.resolution,
                    size: data.size
                },
                this.scene
            );

            this.dome.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);
            this.dome.position.set(data.position[0], data.position[1], data.position[2]);
            this.dome.scaling.set(data.scaling[0], data.scaling[1], data.scaling[2]);
        }
    }
    loadSpotsData() {
        //console.log("this.setting");
        //console.log(this.setting);
        this.spotsloader.loadSpots(this.spotsData, this.setting.Tags, this._url, this.setting, this.meshloader, this.mobile);
    }
    initProject() {
        //console.log("Engine: ", this.engine);
        this.camera = this.CreateCamera(this.setting.setup.view, "DeafultCamera");

        // let camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true); // Add lights to the scene

        this.setPostProcess();
        this.setHDR(this.setting.setup.view);
        const meshes = Object.assign({}, this.setting.setup.Geometry);
        this.meshloader.loadMeshes(meshes, this._url, this.setting,this.mobile);
        this.renderScene();
        this.sceneInitiated = true;
    }
    renderScene() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        /**
         * Need to ask what this is doing
         */
        if (this.engine) {
            // @ts-ignore
            window.addEventListener("resize", this.engine.resize());
        }
    }
    setPostProcess() {
        //Default Post Process Pipeline
        var defaultPipeline = new DefaultRenderingPipeline(
            "default", // The name of the pipeline
            true, // Do you want the pipeline to use HDR texture?
            this.scene
        );
        defaultPipeline.samples = 4;
        this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
        this.scene.imageProcessingConfiguration.toneMappingType = 1;
        this.scene.imageProcessingConfiguration.exposure = 1.0;
        this.scene.imageProcessingConfiguration.contrast = 1.4;

        defaultPipeline.fxaaEnabled = true; // false by default
        if (defaultPipeline.fxaaEnabled) {
            defaultPipeline.fxaa.adaptScaleToCurrentViewport = true; // false by default
        }

        // var gl_glow = new GlowLayer("glow", this.scene,
        //     {
        //         mainTextureFixedSize: Number(postProcess.glowTextureFixedSize),
        //         blurKernelSize: Number(postProcess.glowkernel)
        //     });
        this.defaultPipeline = defaultPipeline;
        // this.gl_glow = gl_glow;
        //this.tss = setTemporalSuperSamplingUp(this.scene, { ratio: 1.0 });
    }

    setHDR(_skyBox) {
        //console.log(`Skybox: ${_skyBox}`);
        this.hdrTexture = CubeTexture.CreateFromPrefilteredData(
            this._url + "maps/" + _skyBox.skymap + ".env",
            this.scene
        );
        this.hdrTexture.name = _skyBox.skymap;
        if (_skyBox.skyvalue) {
            this.hdrTexture.setReflectionTextureMatrix(
                Matrix.RotationY(Tools.ToRadians(_skyBox.skyvalue))
            );
        }
        //console.log(
        //     `getReflectionTextureMatrix: ${this.hdrTexture.getReflectionTextureMatrix()}`
        // );

        this.scene.environmentTexture = this.hdrTexture;
        this.curve = new ColorCurves();
        this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
        this.scene.imageProcessingConfiguration.colorCurves = this.curve;
        this.curve.globalHue = 0;
        this.curve.globalDensity = 0;
        this.curve.globalSaturation = 0;


        this.scene.imageProcessingConfiguration.toneMappingEnabled =
            _skyBox.toneMapping;
        this.scene.imageProcessingConfiguration.exposure = _skyBox.skyexposer;
        this.scene.imageProcessingConfiguration.contrast = _skyBox.skycontrast;
        this.sactivity.hdrLoaded = true;
        this.loadCompleted("hdr loaded");
        //console.log(this.hdrTexture);
        return this.hdrTexture;
    }



    changeHDR(_skyBox) {
        if (this.hdrTexture !== _skyBox.skymap) {
            this.hdrTexture = CubeTexture.CreateFromPrefilteredData(
                this._url + "maps/" + _skyBox.skymap + ".env",
                this.scene
            );
            this.hdrTexture.name = _skyBox.skymap;

            if (_skyBox.skyvalue) {
                this.hdrTexture.setReflectionTextureMatrix(
                    Matrix.RotationY(Tools.ToRadians(_skyBox.skyvalue))
                );
            }
            this.scene.environmentTexture = this.hdrTexture;

        }
        else {
            if (_skyBox.skyvalue) {
                // @ts-ignore
                this.hdrTexture.setReflectionTextureMatrix(
                    Matrix.RotationY(Tools.ToRadians(_skyBox.skyvalue))
                );
            }

        }

        // @ts-ignore
        this.curve.globalHue = _skyBox.hue;
        // @ts-ignore
        this.curve.globalDensity = _skyBox.density;
        // @ts-ignore
        this.curve.globalSaturation = _skyBox.saturation;

        this.scene.imageProcessingConfiguration.toneMappingEnabled =
            _skyBox.toneMapping;
        this.scene.imageProcessingConfiguration.exposure = _skyBox.skyexposer;
        this.scene.imageProcessingConfiguration.contrast = _skyBox.skycontrast;
        this.sactivity.hdrLoaded = true;
        this.loadCompleted("hdr loaded");
    }

    // eslint-disable-next-line no-unused-vars
    loadCompleted(name) {
        //console.log("Loading Complete for ", name);
        if (
            this.sactivity.hdrLoaded &&
            !this.sactivity.spotsLoaded &&
            !this.sactivity.glbLoaded &&
            !this.sactivity.textureLoaded &&
            !this.sactivity.materialLoaded
        )
            this.sactivity.Callback.loadPercent(20);
        if (
            this.sactivity.hdrLoaded &&
            !this.sactivity.spotsLoaded &&
            this.sactivity.glbLoaded &&
            !this.sactivity.textureLoaded &&
            !this.sactivity.materialLoaded
        )
            this.sactivity.Callback.loadPercent(60);
        if (
            this.sactivity.hdrLoaded &&
            !this.sactivity.spotsLoaded &&
            this.sactivity.glbLoaded &&
            this.sactivity.textureLoaded &&
            !this.sactivity.materialLoaded
        )
            this.sactivity.Callback.loadPercent(70);
        if (
            this.sactivity.hdrLoaded &&
            !this.sactivity.spotsLoaded &&
            this.sactivity.glbLoaded &&
            this.sactivity.textureLoaded &&
            this.sactivity.materialLoaded
        ) {
            this.sactivity.Callback.loadPercent(90);
        }
        if (
            this.sactivity.hdrLoaded &&
            this.sactivity.spotsLoaded &&
            this.sactivity.glbLoaded &&
            this.sactivity.textureLoaded &&
            this.sactivity.materialLoaded &&
            !this.sactivity.triggerOnce
        ) {
            this.sactivity.Callback.loadPercent(100);
            this.sactivity.triggerOnce = true;
            this.sactivity.Callback.setLoader(false);

            // setTimeout(() => {
            //     // @ts-ignore
            //     // this.camera.autoRotationBehavior = true;
            // }, 3000);

            this.setCameraRotation();
        }
    }

    setCameraRotation() {
        setTimeout(() => {

            // //console.log("this.camera");
            this.webglEnableAutoRotation();

        }, 3000);
    }
    // from vue to webgl
    webglShow3DIcons() {
        this.spotsloader.showSpots();
        if (this.setting && this.setting.setup && this.setting.setup.featureMeshEnable) {
            this.meshloader.showFeatureMesh(this.setting.setup.featureMeshEnable);
        }
    }
    webglHide3DIcons() {
        this.spotsloader.hideSpots();
        if (this.setting && this.setting.setup && this.setting.setup.featureMeshEnable) {
            this.meshloader.hideFeatureMesh(this.setting.setup.featureMeshEnable);
        }
    }
    webglShow3DTags() {
        this.spotsloader.showTags();
    }
    webglHide3DTags() {
        this.spotsloader.hideTags();
    }
    webglResetAnimations() {

        this.scene.animationGroups.forEach(element => {
            element.play();
            element.goToFrame(0);
            element.stop();
        });
        if (this.setting && this.setting.setup && this.setting.setup.deafaultResetClip) {
            // this.meshloader.hideFeatureMesh(this.setting.setup.featureMeshEnable);
            for (let index = 0; index < this.setting.setup.deafaultResetClip.length; index++) {
                const clipname = this.setting.setup.deafaultResetClip[index];
                if (this.scene.getAnimationGroupByName(clipname)) {
                    var clip = this.scene.getAnimationGroupByName(clipname);
                    clip.play();
                    clip.goToFrame(0);
                    clip.stop();
                }

            }
        }
        this.webglEnableAutoRotation();
    }
    webglDisableAutoRotation() {
        if (!this.autoRotate)
            return;
        if (this.camera)
            this.camera.useAutoRotationBehavior = false;
    }
    webglEnableAutoRotation() {
        if (!this.autoRotate)
            return;
        if (this.camera) {
            this.camera.useAutoRotationBehavior = true;
            this.camera.autoRotationBehavior.idleRotationSpeed = 0.05;
            this.camera.autoRotationBehavior.idleRotationWaitTime = 3000;
            this.camera.autoRotationBehavior.idleRotationSpinupTime = 2;
        }

    }
}
