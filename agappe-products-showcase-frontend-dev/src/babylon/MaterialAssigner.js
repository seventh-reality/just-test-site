// import { SceneSetup } from "./SceneSetup";
import { AssetTaskState } from "@babylonjs/core/Misc/assetsManager";
import { AssetsManager } from "babylonjs";
import { Tools } from "babylonjs";
import { Color3 } from "babylonjs";

export class MaterialAssigner {

    // __url = "assets/";
    constructor(sceneInstance, scene, sactivity) {
        this.ImageToLoad = [];
        this.TexNotFound = [];
        this.textures = {};
        // this.__url = "assets/";
        this.sceneInstance = sceneInstance;
        this.scene = scene;
        this.sactivity = sactivity;
        this._TexManager = new AssetsManager(this.scene);
        this._b = [
            "coating",
            "coatingTint",
            "useAmbientOcclusionFromMetallicTextureRed",
            "useMetallnessFromMetallicTextureBlue",
            "useRoughnessFromMetallicTextureGreen",
            "useRadianceOcclusion",
            "unlit",
            "usealbedoasopacity",
            "backFaceCulling",
            "disableLighting",
            "useRoughnessFromMetallicTextureAlpha",
            "isCarPaintHDR",
        ];
        this._t = [
            "albedoTexture",
            "bumpTexture",
            "metallicTexture",
            "opacityTexture",
            "lightmapTexture",
            "reflectionTexture",
            "bumpDetailTexture",
            "occlusionTexture",
            "emissiveTexture",
        ];
        this._f = [
            "alpha",
            "coating_intensity",
            "coating_roughness",
            "metallic",
            "roughness",
            "transparencyMode",
            "environmentIntensity",
            "coating_IOR",
            "emissiveIntensity",
            "reflectionRadian",
            "occlusionStrength",
        ];
        this._c = ["albedoColor", "clearCoat_tintColor", "emissiveColor"];

        this.replaceList = Object.keys(this.propr);

        this.setupAssetLoader();
    }

    setupAssetLoader() {
        try {
            this._TexManager.onTaskSuccessObservable.add((tasks) => {
                this.textures[tasks.name] = tasks;
            });

            // eslint-disable-next-line no-unused-vars
            this._TexManager.onTasksDoneObservable.add((_tasks) => {
                _tasks.filter((task) => task.taskState == AssetTaskState.ERROR);
                this.onTaskDone();
            });
        } catch (e) {
            //console.log(e);
        }
    }

    StartLoadingTexture(TextureData, materialData, _url, isMobile, mobilemaps) {
        //console.log("Start Loading Texture");
        //console.log(this.ImageToLoad);
        //console.log(this.TexNotFound);
        //console.log(this.textures);
        this.ImageToLoad = [];
        this.TexNotFound = [];

        Object.keys(this.textures).forEach(item => {
            if (this.textures[item].texture) {
                this.textures[item].texture.dispose();
            }
        });

        this.textures = {};
        this.materialData = Object.assign({}, materialData);
        this.url = _url;

        var str = this.url.substring(0, this.url.lastIndexOf("/"));
        var spotUrl = str.substr(0, str.lastIndexOf("/") + 1);
        this.commonUrl = spotUrl + "common/",
        // NOTE : assigning 'new AssetsManager' in constructor call
        this._TexManager.useDefaultLoadingScreen = false;
        this._TexManager.reset();

        const Texjson = Object.assign({}, TextureData);
        for (let i = 0; i < Object.keys(Texjson).length; i++) {
            let path;
            let name = Object.keys(Texjson)[i];
            if (name != "Cube_Tex_3.jpg" && this.TexNotFound.includes(name) == false && name != "count") {
                this.ImageToLoad.push(name);
                if (isMobile && mobilemaps && mobilemaps[name]) {
                    path = this.commonUrl + mobilemaps[name];
                }
                else
                    path = this.url + "textures/" + name;
                Tools.UseFallbackTexture = false; // skip the texture if missing
                this._TexManager.addTextureTask(name, path, false, false);
            }
        }
        this.LoadTexture(Texjson);
    }

    /*
     * start loading all the texture available in all material
     * and assign the texture to material by reading "_matSceneRef"
     *  4.1
     */
    // eslint-disable-next-line no-unused-vars
    LoadTexture(Texjson) {

        if (Object.keys(this.ImageToLoad).length <= 0) {
            // this.onTaskDone();
            //console.log("No Texture To Load");
            return;
        }

        this._TexManager.load();

    }
    onTaskDone() {
        this._TexManager.reset();
        this.sactivity.textureLoaded = true;
        this.sceneInstance.loadCompleted("Texture Loaded ");
        this.SetMats();

        //this.s_objManag.ObjCompleteScript.onLoadingComplete();
    }

    propr = {
        "diffuseMap": "albedoTexture",
        "diffuseMap_repeat": "albedoTexture_repeat",
        "metallicMap": "metallicTexture",
        "metallicMap_repeat": "metallicTexture_repeat",
        "opacity": "alpha",
        "diffuseTextureType": "transparencyMode",
        "diffuseColor": "albedoColor",
        "skyMapIntensity": "environmentIntensity",
        "occlusionIntensity": "occlusionStrength",
        "onMetalMetallicMapBlue": "useMetallnessFromMetallicTextureBlue",
        "onAoMetallicMapRed": "useAmbientOcclusionFrommetallicTextureRed",
        "onRoughnessMetallicMapGreen": "useRoughnessFrommetallicTextureGreen",
        "onAmbientOcclusionMapMetallicGreen": "useAmbientOcclusionFromMetallicTextureRed",
        "coating_tintColor": "clearCoat_tintColor"



        // "coating_IOR": "clearCoat_IOR",
        // "coating_intensity": "clearCoat_intensity",
        // // "coating": "clearCoat_isEnabled",
        // "coating_roughnsess": "clearCoat_roughness",
        // "coatingTint": "clearCoat_isTintEnabled",

    }


    replaceList = [];
    SetMats() {
        const matnames = Object.keys(this.materialData);
        matnames.forEach((name) => {
            const _mat = this.scene.getMaterialByName(name);
            if (_mat) {

                const _matkeys = Object.keys(
                    this.materialData[name]
                );
                for (let index = 0; index < this.replaceList.length; index++) {
                    const oldKey = this.replaceList[index];
                    // console.log("oldKey"+oldKey)
                    // console.log("oldKey"+this.materialData[name].oldKey)

                    if (_matkeys.includes(oldKey)) {
                        // console.log("newkey")
                        // this.materialData[name].this.propr[oldKey] = this.materialData[name].oldKey;
                        const newkey = this.propr[oldKey];

                        // console.log("newkey",this.materialData[name][oldKey])
                        // this.materialData[name]=    Object.assign(this.materialData[name], {newkey: this.materialData[name].oldKey});

                        this.materialData[name][newkey] = this.materialData[name][oldKey];
                        // console.log("newkey",this.materialData[name][newkey])

                        delete this.materialData[name][oldKey];
                        // console.log(this.materialData[name].newkey);

                    }

                }

                const _matPropsNames = Object.keys(
                    this.materialData[name]
                );
                // console.log(_matPropsNames)
                // if (this.materialData[name].diffuseMap) {
                //     Object.defineProperty(this.materialData[name], new_key,
                //         Object.getOwnPropertyDescriptor(o, old_key));
                //     delete o[old_key];
                // }


                // console.log(this.materialData[name])
                _matPropsNames.forEach((propName) => {
                    if (this._b.includes(propName)) {
                        this.setB(
                            _mat,
                            propName,
                            this.materialData[name][propName]
                        );
                    } else if (this._t.includes(propName)) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (this.materialData[name].hasOwnProperty(propName + "_repeat"))
                            this.setT(
                                _mat,
                                propName,
                                this.materialData[name][propName],
                                this.materialData[name][propName + "_repeat"]
                            );
                        else
                            this.setT(
                                _mat,
                                propName,
                                this.materialData[name][propName],
                                null
                            );
                    } else if (this._f.includes(propName)) {
                        this.setf(
                            _mat,
                            propName,
                            this.materialData[name][propName]
                        );
                    } else if (this._c.includes(propName)) {
                        this.setC(
                            _mat,
                            propName,
                            this.materialData[name][propName]
                        );
                    }
                    // else if (this._v.includes(propName)) {
                    //     // this.setV(_mat, propName, this.materialData[name][propName])
                    // }
                });
            }
        });
        this.sactivity.materialLoaded = true;
        this.sceneInstance.loadCompleted("Material Loaded.");
        this.sceneInstance.loadSpotsData();
    }
    setT(mat, propName, mapName, repeatValue) {
        // //console.log("propName ",propName)
        // //console.log("mapName ",mapName)
        // //console.log("mat ",mat)
        // // //console.log(this.textures)
        // //console.log(mat[propName])
        // //console.log(this.textures[mapName])
        if (this.textures[mapName]) {
            if (repeatValue == null) mat[propName] = this.textures[mapName].texture;
            else {
                let texture = this.textures[mapName].texture.clone();
                texture.uRotationCenter = 0;
                texture.vRotationCenter = 0;
                texture.uScale = repeatValue[0];
                texture.vScale = repeatValue[1];
                mat[propName] = texture;
            }
        }
    }
    setB(mat, propName, value) {
        if (value == null || value == undefined) return;
        let value_ = value;
        if (typeof value == "string") value_ = value == "true" ? true : false;
        // //console.log("Boolean: ", mat.name, " >> ", propName, " >> ", value);
        if (propName == "coatingTint") {
            mat["clearCoat"]["isTintEnabled"] = value_;
        } else if (propName == "coating") {
            mat["clearCoat"]["isEnabled"] = value_;
        } else {
            mat[propName.toString()] = value_;
        }
    }
    setf(mat, propName, value) {
        if (propName == "coating_intensity") {
            mat["clearCoat"]["intensity"] = Number(value);
        } else if (propName == "coating_IOR") {
            mat["clearCoat"]["indexOfRefraction"] = Number(value); // New
        } else if (propName == "coating_roughness") {
            mat["clearCoat"]["roughness"] = Number(value);
        } else if (propName == "bumpTexture_scale") {
            mat["bumpTexture"]["level"] = Number(value);
        } else if (propName == "reflectionRadian") {
            mat["reflectionRadian"] = Number(value);
        } else mat[propName] = Number(value);
    }
    setC(mat, key, value) {
        ////console.log("COLOR : ", mat.name, ">> ", key, ">>", value);
        if (value == null || value == undefined) return;
        let value_ = value;
        if (key == "clearCoat_tintColor") {
            mat["clearCoat"]["tintColor"] = new Color3(
                Number(value_[0]),
                Number(value_[1]),
                Number(value_[2])
            );
            //mat["clearCoat"]["isTintEnabled"] = true;
        } else if (key == "emissiveColor") {
            if (value == null) {
                mat[key.toString()] = new Color3(0, 0, 0);
            } else {
                mat[key.toString()] = new Color3(
                    Number(value_[0]),
                    Number(value_[1]),
                    Number(value_[2])
                );
            }
        } else {
            mat[key.toString()] = new Color3(
                Number(value_[0]),
                Number(value_[1]),
                Number(value_[2])
            );
        }
    }
}
