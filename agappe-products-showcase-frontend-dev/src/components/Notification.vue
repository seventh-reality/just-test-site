<template>
  <div class="text-gray-800 dark:text-white">
    <notification-group group="bottom" position="bottom" class="z-30">
      <div
        class="
          fixed
          inset-x-0
          bottom-0
          left-0
          flex
          items-start
          justify-end
          p-6
          px-4
          py-6
          pointer-events-none
        "
      >
        <div class="w-full max-w-sm">
          <notification v-slot="{ notifications, close }">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="{
                'border-red-500': notification.type === 'error',
                'border-green-500': notification.type === 'success',
                'border-blue-500': notification.type === 'info',
                'border-yellow-500': notification.type === 'warning',
              }"
              class="
                flex
                w-full
                max-w-sm
                mx-auto
                mt-4
                overflow-hidden
                bg-white
                border
                rounded-lg
                shadow-md
                dark:bg-gray-800
              "
            >
              <div
                class="flex items-center justify-center w-16 bg-opacity-25"
                :class="{
                  'bg-red-500 ': notification.type === 'error',
                  'bg-green-500': notification.type === 'success',
                  'bg-blue-500': notification.type === 'info',
                  'bg-yellow-500': notification.type === 'warning',
                }"
              >
                <!-- Success Heroicon: badge-check -->
                <svg
                  v-if="notification.type === 'success'"
                  class="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <!-- Error Heroicon: x-circle -->
                <svg
                  v-if="notification.type === 'error'"
                  class="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <!-- Info Heroicon: information-circle -->
                <svg
                  v-if="notification.type === 'info'"
                  class="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <!-- Warning Heroicon: -->
                <svg
                  v-if="notification.type === 'warning'"
                  class="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="w-full px-4 py-2 -mx-3">
                <div class="mx-3 text-left">
                  <span
                    class="font-semibold"
                    :class="{
                      'text-red-500 ': notification.type === 'error',
                      'text-green-500': notification.type === 'success',
                      'text-blue-500': notification.type === 'info',
                      'text-yellow-500': notification.type === 'warning',
                    }"
                  >
                    {{ notification.title }}
                  </span>
                  <p class="text-sm">
                    {{ notification.text }}
                  </p>
                </div>
              </div>
              <button
                class="w-16 px-4 py-3 outline-none pointer-events-auto"
                @click="close(notification.id)"
              >
                <svg
                  :class="{
                    'text-red-500 ': notification.type === 'error',
                    'text-green-500': notification.type === 'success',
                    'text-blue-500': notification.type === 'info',
                    'text-yellow-500': notification.type === 'warning',
                  }"
                  class="w-6 h-6 fill-current"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  title="Close"
                >
                  <path
                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
                  />
                </svg>
              </button>
            </div>
          </notification>
        </div>
      </div>
    </notification-group>
  </div>
</template>
<script>
export default {
    name: "AppNotification",
};
</script>
