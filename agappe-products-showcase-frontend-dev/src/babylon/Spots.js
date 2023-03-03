import { Texture, Vector3 } from "babylonjs";
import { SpriteManager, Sprite } from "babylonjs";
import { ClipPlayer } from "./ClipPlayer";

export class Spots extends ClipPlayer {
    constructor(sceneInstance, scene, sactivity) {
        super();
        this.tags = [];
        this.tagsMan = [];
        this.tagsSprite = [];
        this.spots = [];
        this.spotsMan = [];
        this.sceneInstance = sceneInstance;
        this.scene_ = scene;
        this.sactivity = sactivity;

        this.spotSize=0.2;

        // this.clipPlayer = clipPlayer;
        this.clickEvent();
    }
    getTagMesh(name) {

        if (this.scene_.getTransformNodeByName(name) !== null) {
            return this.scene_.getTransformNodeByName(name);
        } else if (this.scene_.getMeshByName(name) !== null) {
            return this.scene_.getMeshByName(name);
        } else {
            console.warn("Mesh not found to show ", name);
        }
    }
    loadSpots(spotData, tagsData, url, setting, meshLoader,isMobile) {
        this.setting = setting;
        this._url = url;

        if(isMobile && this.setting.setup.size)
        {
            this.spotSize=this.setting.setup.size[1];
        }
        else if(this.setting.setup.size)
        {
            this.spotSize=this.setting.setup.size[0];

        }

    
        this.meshLoader = meshLoader;

        this.spotsData = Object.assign({}, spotData);
        //console.log("spotsData");
        //console.log(this.spotsData);
        // this.tagsData = Object.assign({}, tagsData);
        //console.log(this._url);

        var str = this._url.substring(0, this._url.lastIndexOf("/"));
        var spotUrl = str.substr(0, str.lastIndexOf("/") + 1);

        // console.log("spotUrl");
        // console.log(spotUrl);
        this.ex_spriteManagerPlayer = new SpriteManager(
            "sM__Spot",
            spotUrl + "common/spot.png",
            this.setting.setup.SpotsCount,
            { width: 512, height: 512 },
            this.scene_
        );

        this.dispose();
        Object.keys(this.spotsData).forEach((element) => {
            const data = Object.assign({}, this.spotsData[element]);
            this.addSprite(data);
        });


        if (this.setting.setup.TagsCount != null && this.setting.setup.Tag != null) {
            for (let index = 1; index <= this.setting.setup.TagsCount; index++) {
                ////console.log("Tag__" + index + "_")
                const tagmat = this.scene_.getMaterialByName(this.setting.setup.Tag + "_Tag_" + index);
                if (tagmat) {
                    tagmat.transparencyMode = 2;
                    tagmat.alpha = 1;
                    tagmat.backFaceCulling = true;
                    var text = new Texture(this.sceneInstance._url + "tags/" + index + "_Tag" + ".png", this.sceneInstance.scene, false, false);
                    this.tagsSprite.push(text);
                    if (tagmat.albedoTexture)
                        tagmat["albedoTexture"] = text;
                    tagmat.opacityTexture = tagmat.albedoTexture;
                    tagmat.alphaCutOff = 0.4;
                    tagmat.usealbedoasopacity = true;
                    tagmat.needDepthPrePass = true;
                    tagmat.environmentIntensity = 1.5;
                    // tagmat.unlit = false;
                }
            }
        }



        this.hideTags();
        this.hideSpots();
        this.sactivity.spotsLoaded = true;
        this.sceneInstance.loadCompleted("Spots Loaded.");
    }
    clickEvent() {
        // Creating onPointerDown() on this.scene_  object
        // eslint-disable-next-line no-unused-vars
        this.scene_.onPointerDown = (_evt) => {
            let pickResult = this.scene_.pickSprite(
                this.scene_.pointerX,
                this.scene_.pointerY
            );
            // //console.log(pickResult);
            if (pickResult && (pickResult.pickedSprite != null) && pickResult.pickedSprite.name) {
                // //console.log(pickResult.pickedSprite.name);
                if (this.spotsData[pickResult.pickedSprite.name].type == "animation") {
                    if (this.spotsData[pickResult.pickedSprite.name].meta_data.type == "3dclip") {
                        this.playClip(
                            this.scene_,
                            this.spotsData[pickResult.pickedSprite.name]
                                .meta_data.clipname
                        );

                    }
                }
                this.hideSpots();
                this.sceneInstance.webglDisableAutoRotation();
                // eslint-disable-next-line no-prototype-builtins
                if (this.spotsData.hasOwnProperty(pickResult.pickedSprite.name)) {
                    let resetRotationOnComplete = null;
                    // eslint-disable-next-line no-prototype-builtins
                    if (this.spotsData[pickResult.pickedSprite.name].hasOwnProperty("meta_data") && this.spotsData[pickResult.pickedSprite.name].meta_data.hasOwnProperty("resetRotationOnComplete"))
                        resetRotationOnComplete = this.spotsData[pickResult.pickedSprite.name].meta_data.resetRotationOnComplete;

                    const data = Object.assign({}, {
                        "id": this.spotsData[pickResult.pickedSprite.name].id,
                        "name": this.spotsData[pickResult.pickedSprite.name].name,
                        "path": this.spotsData[pickResult.pickedSprite.name].path,
                        "type": this.spotsData[pickResult.pickedSprite.name].type,
                        "meta_data": {
                            "onScreenText": this.spotsData[pickResult.pickedSprite.name].meta_data.onScreenText,
                            "voiceover": this.spotsData[pickResult.pickedSprite.name].meta_data.voiceover,
                            "resetRotationOnComplete": resetRotationOnComplete
                        }
                    });
                    // Passing data to vue-MediaModal
                    //console.log(data);
                    if (
                        (window["eTriggerContent"] != undefined ||
                            window["eTriggerContent"] != null) &&
                        typeof window["eTriggerContent"] == "function"
                    ) {
                        window["eTriggerContent"](data);
                    }
                }
            }
        };
    }

    addSprite(data) {
        // //console.log("Sprite ", data.name)
        // //console.log(data)
        let ex_sprite = new Sprite(data.name, this.ex_spriteManagerPlayer);
        ex_sprite.size = this.spotSize;
        ex_sprite.isPickable = true;
        this.ex_spriteManagerPlayer.isPickable = true;
        ex_sprite.isVisible = true;
        ex_sprite.position = new Vector3(
            data.hotspot.x,
            data.hotspot.y,
            data.hotspot.z
        );
        this.spots.push(ex_sprite);
    }

    setPosition(index, x, y, z) {
        this.spots[index].position.x = x;
        this.spots[index].position.y = y;
        this.spots[index].position.z = z;
    }

 
    getPosition(index) {
        // eslint-disable-next-line no-unused-vars
        var str =
            "{x:" +
            this.spots[index].position.x +
            "," +
            "y:" +
            this.spots[index].position.y +
            "," +
            "z:" +
            this.spots[index].position.z +
            "}";
        //console.log(str);
    }
    addTag(data) {
        // Create material from image with alpha
        // var mat = new BABYLON.StandardMaterial("dog", this.scene_ );
        // mat.diffuseTexture = new BABYLON.Texture(  this._url + "tags/" + data.hpImageName + ".png", this.scene_ );
        // mat.diffuseTexture.hasAlpha = true;
        // mat.backFaceCulling = false;

        // Apply material to a box
        // var ex_sprite = BABYLON.MeshBuilder.CreatePlane("plane", {}, this.scene_ );
        // ex_sprite.material = mat;

        // let ex_spriteManagerPlayer = new SpriteManager("playerManager",   this._url + "hotspots/image/" + data.hpImageName + ".png", 1, {width: 256, height: 256}, this.scene_ );
        let ex_spriteManagerPlayer = new SpriteManager(
            "playerManager",
            this._url + "tags/" + data.hpImageName + ".png",
            1,
            { width: 512, height: 512 },
            this.scene_
        );
        let ex_sprite = new Sprite(data.name, ex_spriteManagerPlayer);

        ex_sprite.size = 0.15;
        // ex_sprite.height=0.23;
        ex_sprite.width = 1.5;
        ex_sprite.height = 0.34;
        ex_sprite.isPickable = false;
        ex_spriteManagerPlayer.isPickable = false;
        ex_sprite.position = new Vector3(
            data.hotspot.x,
            data.hotspot.y,
            data.hotspot.z
        );
        // ex_sprite.setEnabled(false)
        this.tags.push(ex_sprite);
        // ex_spriteManagerPlayer.renderingGroupId=2
        this.tagsMan.push(ex_spriteManagerPlayer);
    }
    dispose() {
        this.spots.forEach((spot) => {
            spot.dispose();
        });
        this.spotsMan.forEach((spot) => {
            spot.dispose();
        });

        this.tagsSprite.forEach((spot) => {
            spot.dispose();
        });
        // this.tags.forEach((spot) => {
        //     spot.dispose();
        // });
        // this.tagsMan.forEach((spot) => {
        //     spot.dispose();
        // });

        this.spots = [];
        this.spotsMan = [];
        this.tags = [];
        this.tagsMan = [];
        this.tagsSprite = [];
    }

    hideSpots() {
        this.spots.forEach((spot) => {
            spot.isVisible = false;
            spot.isPickable = false;
        });
    }
    showSpots() {
        this.spots.forEach((spot) => {
            spot.isVisible = true;
            spot.isPickable = true;
        });
    }

    hideTags() {
        if (this.setting.setup.TagMesh != null && this.meshLoader.meshData[this.setting.setup.TagMesh] && this.meshLoader.meshData[this.setting.setup.TagMesh].mesh) {
            this.meshLoader.meshData[this.setting.setup.TagMesh].mesh.setEnabled(false);
        }
        // this.tags.forEach((spot) => {
        //     spot.isVisible = false;
        // });
    }
    showTags() {
        if (this.setting.setup.TagMesh != null && this.meshLoader.meshData[this.setting.setup.TagMesh] && this.meshLoader.meshData[this.setting.setup.TagMesh].mesh) {
            this.meshLoader.meshData[this.setting.setup.TagMesh].mesh.setEnabled(true);
        }
        // this.tags.forEach((spot) => {
        //     spot.isVisible = true;
        // });
    }

    playClip(scene, clipName) {
        scene
            .getAnimationGroupByName(clipName)
            .onAnimationGroupPlayObservable.addOnce(() => {

                if (
                    (window["eAnimationStarted"] != undefined ||
                        window["eAnimationStarted"] != null) &&
                    typeof window["eAnimationStarted"] == "function"
                ) {
                    window["eAnimationStarted"](null);
                }
            });
        scene
            .getAnimationGroupByName(clipName)
            .onAnimationGroupEndObservable.addOnce(() => {
                if (
                    (window["eAnimationCompleted"] != undefined ||
                        window["eAnimationCompleted"] != null) &&
                    typeof window["eAnimationCompleted"] == "function"
                ) {
                    window["eAnimationCompleted"](true);
                }
            });
        // scene
        //     .getAnimationGroupByName(clipName)
        //     .onAnimationGroupPauseObservable.addOnce(() => {
        //     });
        scene.getAnimationGroupByName(clipName).play();
    }
}
