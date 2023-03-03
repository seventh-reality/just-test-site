<template>
  <div id="app">
    <router-view />
    <MediaModal />
    <AppNotification />
    <Loader />
    <DeviceOrientationChecking />
  </div>
</template>
<script>
import MediaModal from "./components/MediaModal.vue";
import AppNotification from "./components/Notification.vue";
import Loader from "./components/Loader.vue";
import DeviceOrientationChecking from "./components/DeviceCheck.vue";
export default {
    components: {
        MediaModal,
        AppNotification,
        Loader,
        DeviceOrientationChecking
    },
};
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
