<template>
  <div class="p-2 flex">
    <div
      class="
        max-w-md
        bg-white
        rounded-lg
        border-2 border-gray-500
        hover:border-blue-500
      "
    >
      <div class="p-4 border-b text-left">
        <span class="text-lg font-bold text-gray-600">Attach Media</span>
      </div>
      <div class="p-3">
        <div class="mb-2">
          <div
            class="
              relative
              h-40
              rounded-lg
              border-dashed border-2 border-gray-200
              bg-white
              flex
              justify-center
              items-center
              hover:cursor-pointer
            "
          >
            <div class="absolute items-center">
              <span class="group relative w-full flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span class="block text-gray-400 font-normal"
                  >&nbsp; Attach you files here</span
                >
              </span>
              <span class="block text-gray-400 font-normal">or</span>
              <span class="block text-blue-400 font-normal">Browse files</span>
            </div>
            <input
              type="file"
              class="h-full w-full invisible"
              name="mediaUplaod"
            />
          </div>
        </div>
        <div class="mt-3 text-center pb-3">
          <button
            @click="performUplaod()"
            class="
              group
              relative
              w-full
              flex
              justify-center
              py-2
              px-4
              border border-transparent
              text-sm
              font-medium
              rounded-md
              text-white
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            <span
              class="
                absolute
                left-0
                inset-y-0
                flex
                items-center
                pl-3
                animate-pulse
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </span>
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: "FileUpload",
    methods: {
        ...mapActions("User", ["startLoading", "stopLoading"]),
        performUplaod() {
            this.startLoading({ type: "info", size: "lg" });
            setTimeout(() => {
                this.stopLoading();
            }, 5000);
            this.$notify(
                {
                    group: "bottom",
                    type: "success",
                    title: "Upload Status",
                    text: "Upload Successfull",
                },
                3500
            );
        },
    },
};
</script>
