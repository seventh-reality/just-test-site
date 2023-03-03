export class webglCallbacks {

    // Pass true/false to start or stop loader
    setLoader(value) {
        if (
            (window["eSetLoader"] != undefined || window["eSetLoader"] != null) &&
            typeof window["eSetLoader"] == "function"
        ) {
            window["eSetLoader"](value);
        }
    }
    //Pass Number
    loadPercent(value) {
        if (
            (window["eLoadPercent"] != undefined || window["eLoadPercent"] != null) &&
            typeof window["eLoadPercent"] == "function"
        ) {
            //console.log(`Loaded: ${value}%`);
            window["eLoadPercent"](value);
        }
    }
}
