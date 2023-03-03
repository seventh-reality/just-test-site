/* eslint-disable no-unused-vars */
import { AssetsManager } from "babylonjs";
// @ts-ignore
import "babylonjs-loaders";
import { MeshBuilder } from "babylonjs";
import { AssetTaskState } from "@babylonjs/core/Misc/assetsManager";
import { MaterialAssigner } from "./MaterialAssigner";
export class MeshLoader {
    constructor(sceneInstance, scene, sactivity) {
        this.meshData = {};
        this.sceneInstance = sceneInstance;
        this.scene = scene;
        this.sactivity = sactivity;
        this.mobile=false;
        this.loadedMaterial = {};
        this.loadedanims = {};
        this.materialloader = new MaterialAssigner(sceneInstance, scene, sactivity);

        this.setupAssetLoader();

    }

    loadMeshes(settingMeshData, url, setting,isMobile) {
        this.mobile=isMobile;
        // this.meshData = settingMeshData;
        this.url = url;
        this.setting = setting;
        this.dispose();
        Object.keys(settingMeshData).forEach((element) => {
            //console.log("Screen Mesh Element: ");
            //console.log(element);
            if (element !== "count" && element !== "Room") {
                this.meshData[element] = Object.assign({}, settingMeshData[element]);
                // this.meshData[element].materials={};

                // @ts-ignore
                this._assetsManager.addMeshTask(
                    element,
                    "",
                    this.url + "geometry/",
                    this.meshData[element].name
                );

            }
        });
        // @ts-ignore
        this._assetsManager.load();
    }

    dispose() {
        Object.keys(this.meshData).forEach((name) => {
            //console.log(name);
            this.meshData[name].mesh.dispose();
            delete this.meshData[name];
        });
        Object.keys(this.loadedMaterial).forEach((name) => {
            //console.log(name);
            this.loadedMaterial[name].dispose();
            delete this.loadedMaterial[name];
        });

    }

    /**
   * Prepare Asset Manager
   * Callback For GLB gtlf load
   * @memberof OTV_MeshLoader
   */
    setupAssetLoader() {
        try {
            //Prepare Asset Manager
            this._assetsManager = new AssetsManager(this.scene);
            this._assetsManager.useDefaultLoadingScreen = false;
            this._assetsManager.reset;
            this._assetsManager.onTaskSuccessObservable.add((mesh) => {
                // //console.log("onTaskSuccessObservable");
                this.setProperties(mesh);
            });
            this._assetsManager.onProgressObservable.add((tasks) => {
                // //console.log("onProgressObservable: ", tasks);
                // //console.log((tasks.totalCount - tasks.remainingCount) / tasks.totalCount * 100);
            });
            this._assetsManager.onTaskErrorObservable.add((tasks) => {
                // //console.log("onTaskErrorObservable: ", tasks);
            });
            this._assetsManager.onTasksDoneObservable.add((tasks) => {
                // //console.log("onTasksDoneObservable: ", tasks);
                tasks.filter((task) => task.taskState == AssetTaskState.ERROR);
                this.onTaskDone();
            });
        } catch (e) {
            //console.log(e);
            // this.sactivity.glbLoaded = true;
            // this.sceneInstance.loadCompleted("GLB Loaded");
            // this.materialloader.StartLoadingTexture();
        }
    }
    onTaskDone() {
        // @ts-ignore
        this._assetsManager.reset(); // << New
        this.sactivity.glbLoaded = true;
        this.sceneInstance.loadCompleted("GLB Loaded");

        this.materialloader.StartLoadingTexture(this.setting.setup.maps, this.setting.setup.substance, this.url, this.mobile,this.setting.setup.mapsMobile);
    }
    setProperties(mesh) {
        // //console.log("Mesh: ", mesh);
        // //console.log("Mesh: ", mesh.name);
        this.meshData[mesh.name].mesh = mesh.loadedMeshes[0];
        let setting = this.meshData[mesh.name];
        // //console.log(`Settings: ${setting}`);
        // //console.log(setting);

        mesh.loadedMeshes[0].position.x = setting.position[0];
        mesh.loadedMeshes[0].position.y = setting.position[1];
        mesh.loadedMeshes[0].position.z = setting.position[2];
        // Rotation
        mesh.loadedMeshes[0].renderingGroupId = 2;
        mesh.loadedMeshes[0].rotationQuaternion = null;
        mesh.loadedMeshes[0].rotation.set(
            setting.rotation[0],
            setting.rotation[1],
            setting.rotation[2]
        );

        mesh.loadedMeshes[0].scaling.set(
            setting.scale[0],
            setting.scale[1],
            setting.scale[2]
        );
        mesh.loadedMeshes[0].setEnabled(setting.visible);
        // mesh.
        for (let p in mesh.loadedMeshes) {
            if (mesh.loadedMeshes[p].material) {
                this.loadedMaterial[mesh.loadedMeshes[p].material.name] = mesh.loadedMeshes[p].material;
                // //console.log(mesh.loadedMeshes[p].material.name);
            }
        }

        if (mesh.loadedAnimationGroups.length > 0) {
            for (let p in mesh.loadedAnimationGroups) {
                mesh.loadedAnimationGroups[p].goToFrame(0);
                mesh.loadedAnimationGroups[p].stop();
                // mesh.loadedAnimationGroups[p].loop = false;
                mesh.loadedAnimationGroups[p].loopAnimation = false;


                if (this.loadedanims[mesh.loadedAnimationGroups[p].name]) {
                    // //console.log("found>>");
                    // //console.log(this.loadedanims[mesh.loadedAnimationGroups[p].name]);
                    this.loadedanims[mesh.loadedAnimationGroups[p].name].dispose();
                }
                this.loadedanims[mesh.loadedAnimationGroups[p].name] = mesh.loadedAnimationGroups[p];
            }
        }
    }

    showFeatureMesh(meshes)
    {
        for (let index = 0; index < meshes.length; index++) {
            const meshName = meshes[index];
            if(this.meshData[meshName])
            {
                this.meshData[meshName].mesh.setEnabled(true);
            }
        }
    }
    hideFeatureMesh(meshes)
    {
        for (let index = 0; index < meshes.length; index++) {
            const meshName = meshes[index];
            if(this.meshData[meshName])
            {
                this.meshData[meshName].mesh.setEnabled(false);
            }
        }
    }
}
