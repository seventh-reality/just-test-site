import { ArcRotateCamera, Vector3 } from "babylonjs";

export class CameraManager {
    // @ts-ignore
    constructor(sceneInstance, scene) {
        // this.sceneInstance = sceneInstance;
        this.alpha = 0;
        this.beta = 0;
        this.radius = 0;
        this.scene = scene;
    }

    /**
     * Creates and return new Arc Camera. camera properties are been pass to first Param
     * @param data : data should be as per CameraProperties class
     * @param name : set Camera Name
     */
    CreateCamera(data, name) {
        // POSITION
        if (data.abr) {
            this.alpha = data.abr[0];
            this.beta = data.abr[1];
            this.radius = data.abr[2];
        }

        // TARGET
        let _target = new Vector3(0, 0, 0);
        if (data.abr) {
            _target.x = data.abr[3];
            _target.y = data.abr[4];
            _target.z = data.abr[5];
        }

        // Parameters: alpha, beta, radius, target position, scene
        let _camera = new ArcRotateCamera(
            "OrbitCamera",
            this.alpha,
            this.beta,
            this.radius,
            _target,
            this.scene
        );
        // _camera.useAutoRotationBehavior = false;
        // _camera.attachControl(this.sceneInstance.canvas, false); // Attached camera to scene (canvas , enable cam default input)
        _camera.fov = data.fov || 0.5;
        _camera.wheelDeltaPercentage =  0.01;
        _camera.minZ = 0.01;
        _camera.inertia =  0.8;
        _camera.lowerRadiusLimit = data.lowerRadiusLimit || 0;
        _camera.upperRadiusLimit = data.upperRadiusLimit || 100;
        _camera.panningSensibility = 0; // Panning
        _camera.upperBetaLimit = data.upperBetaLimit || 1.3;
        _camera.alpha = this.alpha;
        _camera.beta = this.beta;
        _camera.radius = Number(this.radius);
        _camera.fov = data.fov;
      
        if (name) {
            _camera.name = name;
        }
        return _camera;
    }

    changeCamera(data, camera) {

        camera.setTarget(new Vector3( data.abr[3], data.abr[4], data.abr[5]));
        camera.lowerRadiusLimit = data.lowerRadiusLimit;
        camera.upperRadiusLimit = data.upperRadiusLimit;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperBetaLimit = data.upperBetaLimit;

        if (data.abr) {
            this.alpha = data.abr[0];
            this.beta = data.abr[1];
            this.radius = data.abr[2];
        }

        camera.alpha = this.alpha;
        camera.beta = this.beta;
        camera.radius = Number(this.radius);
        camera.fov = data.fov;
    }
}
