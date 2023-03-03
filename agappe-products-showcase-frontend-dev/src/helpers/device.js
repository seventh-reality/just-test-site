/* eslint-disable no-undef */
export const Device = {
    checkIfTouchDevice: () => {
        var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
        var mq = (query) => {
            return window.matchMedia(query).matches;
        };
        // @ts-ignore
        if ("ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
            return true;
        }
        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
        return mq(query);
    },
    checkGyroSupport: () => {
        if (window.DeviceOrientationEvent) {
            return true;
        } else {
            return false;
        }
    },
    isMobileDevice: () => {
        return (
            typeof window.orientation !== "undefined" ||
            navigator.userAgent.indexOf("IEMobile") !== -1 ||
            (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i) ||
                navigator.userAgent.match(/Tablet/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/Nexus 7/i) ||
                navigator.userAgent.match(/Nexus 10/i) ||
                navigator.userAgent.match(/KFAPWI/i))
        );
    },
    checkOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            return false;
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            return true;
        }
    }
};