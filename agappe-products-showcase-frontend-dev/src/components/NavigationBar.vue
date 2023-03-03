<template>
  <nav class="bg-gray-300">
    <div class="w-full mx-2 px-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              class="mx-auto h-12 w-40"
              src="../assets/logo.svg"
              alt="logo"
            />
          </div>
          <div class="hidden">
            <div class="ml-10 flex items-baseline space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <a
                v-for="item in menu"
                :key="item.label"
                @click="selectedNav = item.label"
                :class="
                  selectedNav === item.label
                    ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                    : 'text-gray-500 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                "
                >{{ item.label }}</a
              >
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <span
              v-if="getUserInfo.loggedIn"
              class="
                absolute
                hidden
                w-3
                h-3
                rounded-full
                pointer-events-none
                top-3.5
              "
            >
              <span
                class="
                  absolute
                  inline-flex
                  w-full
                  h-full
                  bg-purple-400
                  rounded-full
                  opacity-75
                  animate-ping
                "
              />

              <span
                class="relative inline-flex w-3 h-3 bg-purple-500 rounded-full"
              />
            </span>
            <button
              v-if="getUserInfo.loggedIn"
              class="
                bg-gray-800
                p-1
                rounded-full
                text-gray-400
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-offset-gray-800
                focus:ring-white
                hidden
              "
            >
              <span class="sr-only">View notifications</span>
              <!-- Heroicon name: outline/bell -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button
                  type="button"
                  class="
                    max-w-xs
                    bg-gray-800
                    rounded-full
                    flex
                    items-center
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-offset-gray-800
                    focus:ring-white
                  "
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  @click="openUserMenu = !openUserMenu"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="../assets/user.png"
                    alt="user_profile_pic"
                  />
                </button>
              </div>

              <!--
                    Dropdown menu, show/hide based on menu state.

                    Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                    Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                -->
              <div
                :class="
                  openUserMenu
                    ? 'transition ease-out duration-700 transform opacity-100 scale-100 origin-top-right absolute z-20 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none visible'
                    : 'transition ease-in duration-100 transform opacity-0 scale-95 origin-top-right absolute z-20 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none invisible'
                "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <a
                  v-for="item in userMenu"
                  :key="item.label"
                  class="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                  role="menuitem"
                  tabindex="-1"
                  @click="
                    item.label == 'Sign out'
                      ? logout()
                      : item.label == 'Sign in'
                      ? login()
                      : viewProfile()
                  "
                  id="user-menu-item-0"
                  >{{ item.label }}</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button
            type="button"
            class="
              bg-gray-800
              inline-flex
              items-center
              justify-center
              p-2
              rounded-md
              text-gray-400
              hover:text-white
              hover:bg-gray-700
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-gray-800
              focus:ring-white
            "
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="openMenu = !openMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!--
                Heroicon name: outline/menu

                Menu open: "hidden", Menu closed: "block"
                -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!--
                Heroicon name: outline/x

                Menu open: "block", Menu closed: "hidden"
                -->
            <svg
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden" id="mobile-menu" v-if="openMenu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 hidden">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->

        <a
          v-for="item in menu"
          :key="item.label"
          @click="selectedNav = item.label"
          :class="
            selectedNav === item.label
              ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium block'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium block'
          "
          >{{ item.label }}</a
        >
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <button
            class="mr-auto justify-center flex p-1"
            @click="openUserMenu = !openUserMenu"
          >
            <div class="flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full"
                src="../assets/user.png"
                alt="user_profile_pic"
              />
            </div>
            <div class="ml-3 my-1">
              <div
                class="text-base font-medium leading-none text-white text-left"
              >
                {{ getUserInfo.name }}
              </div>
              <div class="text-sm font-medium leading-none text-gray-400">
                {{ getUserInfo.email }}
              </div>
            </div>
          </button>
          <span
            class="
              absolute
              hidden
              w-3
              h-3
              rounded-full
              pointer-events-none
              top-36
              right-10
            "
          >
            <span
              class="
                absolute
                inline-flex
                w-full
                h-full
                bg-purple-400
                rounded-full
                opacity-75
                animate-ping
              "
            />

            <span
              class="relative inline-flex w-3 h-3 bg-purple-500 rounded-full"
            />
          </span>
          <button
            class="
              ml-auto
              bg-gray-800
              flex-shrink-0
              p-1
              rounded-full
              text-gray-400
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-gray-800
              focus:ring-white
              hidden
            "
          >
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: outline/bell -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
        <div
          :class="
            openUserMenu ? 'mt-3 px-2 space-y-1' : 'mt-3 px-2 space-y-1 hidden'
          "
        >
          <a
            v-for="item in userMenu"
            :key="item.label"
            class="
              block
              px-3
              py-2
              rounded-md
              text-base
              font-medium
              text-gray-400
              hover:text-white
              hover:bg-gray-700
              cursor-pointer
            "
            @click="
              item.label == 'Sign out'
                ? logout()
                : item.label == 'Sign in'
                ? login()
                : viewProfile()
            "
            >{{ item.label }}</a
          >
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "NavigationBar",
    data: () => ({
        menu: [],
        userMenu: [],
        selectedNav: "Products",
        openUserMenu: false,
        openMenu: false,
    }),
    mounted() {
        if (this.selectedNav === "Products") {
            this.$emit("getSelectedNav", "Products");
        }
        if (this.getUserInfo.isAdmin) {
            this.menu = [
                {
                    label: "Editor",
                },
                {
                    label: "Products",
                },
            ];
        } else {
            this.menu = [
                {
                    label: "Products",
                },
            ];
        }
        if (this.getUserInfo.loggedIn) {
            this.userMenu = [
                {
                    label: "Sign out",
                },
            ];
        } else {
            this.userMenu = [
                {
                    label: "Sign in",
                },
            ];
        }
    },
    computed: {
        ...mapGetters("User", ["getUserInfo"]),
    },
    methods: {
        ...mapActions("User", ["logout"]),
        login() {
            this.openUserMenu = false;
            this.openMenu = false;
            this.$router.push({ name: "userAuthentication" });
        },
        viewProfile() {},
    },
    watch: {
        selectedNav(nV, oV) {
            if (nV !== oV) {
                this.$emit("getSelectedNav", nV);
            }
        },
    },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
