// import { SceneSetup } from "./SceneSetup";

export class ModelChange {
    constructor(sceneInstance, sactivity) {
        this.sceneInstance = sceneInstance;
        this.sactivity = sactivity;
    }

    /**
   * get json for change variant
   * @memberof SceneSetup
   */
    changeModelFromLocal(modelName) {
        let names = ["ProductSetting.json"];
        let requests = names.map((name) =>
            fetch(`${"src/assets/" + modelName + "/"}/${name}`)
        );

        Promise.all(requests)
            .then((resp) => Promise.all(resp.map((r) => r.json())));
    }
}
