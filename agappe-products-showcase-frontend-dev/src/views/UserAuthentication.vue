<template>
  <div
    class="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      py-12
      px-4
      sm:px-6
      lg:px-8
    "
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto cursor-pointer"
          src="../assets/logo.svg"
          alt="company-logo"
          style="width: 300px"
          @click="
            () => {
              $router.push({ name: 'landing' });
            }
          "
        />
        <h2 class="text-center text-lg font-bold" style="color: #002581;">VIRTUAL PRODUCT DEMO</h2>
        <h2 class="mt-4 text-center text-xl font-bold text-gray-900">
          <a
            class="
              cursor-pointer
              animate-pulse
              text-indigo-600
              hover:text-indigo-500
              text-2xl
            "
            @click="reset()"
          >
            Sign in
          </a>
          to your account to continue the demo
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a
            @click="
              reset();
              newUser.userSelection = 'SignUp';
            "
            class="
              font-medium
              text-indigo-600
              hover:text-indigo-500
              cursor-pointer
            "
          >
            Register yourself
          </a>
        </p>
      </div>
      <form
        class="mt-8 space-y-6"
        autocomplete="off"
        @submit.prevent="initiateAuth"
      >
        <div class="rounded-md shadow-sm -space-y-px">
          <div v-if="newUser.userSelection === 'SignUp'">
            <label for="full-name" class="sr-only">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              v-model.trim="newUser.name"
              class="
                appearance-none
                rounded-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-t-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              placeholder="Full Name"
            />
          </div>
          <div
            v-if="
              ['SignUp', 'ForgetPassword', 'InitiateAuth'].includes(
                newUser.userSelection
              ) &&
              !mobileAsUsername &&
              !haveAccountConfirmCode &&
              !haveEmailConfirmCode
            "
          >
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model.trim="newUser.email"
              :class="[
                newUser.userSelection === 'ForgetPassword'
                  ? 'rounded'
                  : newUser.userSelection === 'InitiateAuth'
                  ? 'rounded-t-md'
                  : 'rounded-none',
                'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              ]"
              placeholder="Email address"
            />
          </div>
          <div
            class="group relative w-full flex justify-center"
            v-if="
              (mobileAsUsername || newUser.userSelection === 'SignUp') &&
              !haveAccountConfirmCode &&
              !haveEmailConfirmCode
            "
          >
            <label for="mobile" class="sr-only">Mobile</label>
            <select
              :class="[
                newUser.userSelection === 'SignUp'
                  ? 'rounded-none'
                  : newUser.userSelection === 'InitiateAuth' 
                  ? 'rounded-tl-md'
                  : 'rounded-l-md',,
                'form-select justify-center w-full border border-gray-300 px-3 py-2 text-gray-500 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-20 sm:text-sm',
              ]"
              v-model="selectedISDCode"
            >
              <option disabled value="">Select Country</option>
              <option
                v-for="(item, index) in isdCodeList"
                :key="index"
                :value="item.ISD_Code"
              >
                {{ item.name }} ({{ item.ISD_Code }})
              </option>
            </select>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              autocomplete="mobile"
              required
              v-model.trim="newUser.contactNumber"
              :class="[
                newUser.userSelection === 'SignUp'
                  ? 'rounded-none'
                  : newUser.userSelection === 'InitiateAuth'
                  ? 'rounded-tr-md'
                  : 'rounded-r-md',
                'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              ]"
              placeholder="Mobile"
            />
          </div>
          <div v-if="haveAccountConfirmCode">
            <label
              for="confirmation-code-account-verification-and-reset-password"
              class="sr-only"
              >Enter Mobile Verification Code</label
            >
            <input
              id="confirmation_code"
              name="confirmation_code"
              type="text"
              autocomplete="confirmation_code"
              required
              maxlength="6"
              minlength="6"
              v-model.trim="newUser.confirmationCode"
              :class="[
                newUser.userSelection === 'ConfirmForgotPassword'
                  ? 'rounded-t-md'
                  : 'rounded',
                'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              ]"
              :placeholder="newUser.userSelection === 'ConfirmForgotPassword' ? 'Enter Verification Code' : 'Enter Mobile Verification Code'"
            />
          </div>
          <div v-if="haveEmailConfirmCode">
            <label for="email-confirmation-code" class="sr-only"
              >Enter Email Verification Code</label
            >
            <input
              id="confirmation_code_email"
              name="confirmation_code_email"
              type="text"
              maxlength="6"
              minlength="6"
              autocomplete="confirmation_code_email"
              required
              v-model.trim="newUser.emailCode"
              class="
                appearance-none
                rounded
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              placeholder="Enter Email Verification Code"
            />
          </div>
          <div
            class="group relative w-full flex justify-center has-tooltip"
            v-if="
              newUser.userSelection === 'SignUp' ||
              (newUser.userSelection === 'ConfirmForgotPassword' &&
                haveAccountConfirmCode) ||
              (newUser.userSelection === 'InitiateAuth' &&
                !haveAccountConfirmCode &&
                !haveEmailConfirmCode)
            "
          >
            <label for="password" class="sr-only">Password</label>
            <span v-if="newUser.userSelection !== 'InitiateAuth'" class='tooltip rounded shadow-lg p-1 bg-gray-100 text-black text-xs mt-12'>Use at least 8 characters with a mix of upper case letters, lower case letters, numbers and symbols</span>
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              maxlength="16"
              minlength="8"
              v-model.trim="newUser.password"
              required
              :class="[
                ['SignUp', 'ConfirmForgotPassword'].includes(
                  newUser.userSelection
                )
                  ? 'rounded-none'
                  : 'rounded-b-md',
                'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              ]"
              placeholder="Password"
            />
            <span
              class="
                absolute
                right-0
                inset-y-0
                flex
                items-center
                pr-3
                cursor-pointer
              "
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="showPassword"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </span>
            <!-- Need to add conditional classes along with models -->
          </div>
          <div
            v-if="
              ['SignUp', 'ConfirmForgotPassword'].includes(
                newUser.userSelection
              )
            "
            class="group relative w-full flex justify-center has-tooltip"
          >
            <label for="confirm-password" class="sr-only"
              >Confirm Password</label
            >
            <span class='tooltip rounded shadow-lg p-1 bg-gray-100 text-black text-xs mt-12'>Use at least 8 characters with a mix of upper case letters, lower case letters, numbers and symbols</span>
            <input
              id="confirm-password"
              name="confirm-password"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="confirm-password"
              maxlength="16"
              minlength="8"
              required
              v-model.trim="newUser.confirmPassword"
              class="
                appearance-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-b-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              placeholder="Confirm Password"
            />
            <span
              class="
                absolute
                right-0
                inset-y-0
                flex
                items-center
                pr-3
                cursor-pointer
              "
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg
                v-if="showConfirmPassword"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div
            v-if="newUser.userSelection === 'SignUp'"
            class="flex items-center"
          >
            <input
              id="TnC"
              name="TnC"
              type="checkbox"
              v-model="checkTnC"
              class="
                h-4
                w-4
                text-indigo-600
                focus:ring-indigo-500
                border-gray-300
                rounded
              "
            />
            <label
              for="terms_and_conditions"
              class="ml-2 block text-sm text-gray-900"
            >
              I accept the
              <a
                class="
                  font-medium
                  text-indigo-600
                  cursor-pointer
                  hover:text-indigo-500
                "
                target="_blank"
                href="https://www.agappe.com/in/terms-and-conditions"
              >
                terms and conditions
              </a>
            </label>
          </div>
          <div
            v-if="
              newUser.userSelection === 'InitiateAuth' &&
              !haveAccountConfirmCode &&
              !haveEmailConfirmCode
            "
            class="flex items-center"
            style="visibility: hidden;"
          >
            <input
              id="mobileAsUsername"
              name="mobileAsUsername"
              type="checkbox"
              v-model="mobileAsUsername"
              class="
                h-4
                w-4
                text-indigo-600
                focus:ring-indigo-500
                border-gray-300
                rounded
              "
            />
            <label
              for="terms_and_conditions"
              class="ml-2 block text-sm text-gray-900"
            >
              Use mobile for authentication
            </label>
          </div>
          <div
            v-if="
              newUser.userSelection === 'InitiateAuth' &&
              !haveAccountConfirmCode &&
              !haveEmailConfirmCode
            "
            class="flex items-center text-sm cursor-pointer"
          >
            <a
              class="font-medium text-indigo-600 hover:text-indigo-500"
              @click="newUser.userSelection = 'ForgetPassword'"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
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
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg
                v-if="processing"
                class="
                  animate-spin
                  -ml-1
                  mr-3
                  h-5
                  w-5
                  text-white
                  group-hover:text-white
                "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="newUser.userSelection === 'SignUp'"> Sign up </span>
            <span v-else-if="newUser.userSelection === 'InitiateAuth'">
              {{
                haveAccountConfirmCode
                  ? "Verify Mobile Number"
                  : haveEmailConfirmCode
                  ? "Verify Email ID"
                  : "Sign in"
              }}
            </span>
            <span v-else-if="newUser.userSelection === 'ForgetPassword'">
              Send password reset code
            </span>
            <span v-else-if="newUser.userSelection === 'ConfirmForgotPassword'">
              Change password
            </span>
          </button>
        </div>
        <div v-show="errorMessage.length" class="flex items-center text-xs text-red-500">
          <label class="mb-0 -mt-4 mx-auto">{{ errorMessage }}</label>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import isdCodes from "../config/ISDCodes.json";
import { checkPassword } from "../helpers/utils";
export default {
    name: "UserAuthentication",
    data: () => ({
        newUser: {
            name: "",
            email: "",
            contactNumber: "",
            password: "",
            confirmPassword: "",
            userSelection: "InitiateAuth",
            confirmationCode: "",
            emailCode: "",
        },
        checkTnC: false,
        processing: false,
        showPassword: false,
        showConfirmPassword: false,
        haveAccountConfirmCode: false,
        haveEmailConfirmCode: false,
        selectedISDCode: "+91",
        isdCodeList: isdCodes,
        mobileAsUsername: true,
        errorMessage: ""
    }),
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.newUser.contactNumber = "";
                this.newUser.password = "";
                this.newUser.email = "";
            }, 60 * 60 * 1000); // 60 mins
        });
    },
    watch: {
        "newUser.userSelection": {
            // eslint-disable-next-line no-unused-vars
            handler: function (nV, oV) {
                if(nV==="SignUp"){
                    this.mobileAsUsername = false;
                } else {
                    this.mobileAsUsername = true;
                }
                this.errorMessage = "";
            },
            deep: true,
        },
        // eslint-disable-next-line no-unused-vars
        checkTnC(nV, oV) {
            if (this.newUser.userSelection === "SignUp") {
                if (!nV) {
                    this.errorMessage = "Please accept the terms and conditions.";
                } else {
                    this.errorMessage = "";
                }
            }
        }
    },
    methods: {
        ...mapActions("User", ["initiateUserManagement"]),
        reset() {
            Object.assign(this.newUser, {
                name: "",
                confirmPassword: "",
                userSelection: "InitiateAuth",
                confirmationCode: "",
                emailCode: "",
            });
            this.checkTnC = false;
            this.processing = false;
            this.showPassword = false;
            this.showConfirmPassword = false;
            this.haveAccountConfirmCode = false;
            this.haveEmailConfirmCode = false;
            this.selectedISDCode = "+91";
            this.mobileAsUsername = true;
            this.errorMessage = "";
        },
        initiateAuth() {
            if (this.newUser.userSelection === "SignUp") {
                if (this.selectedISDCode.length) {
                    if (this.newUser.password === this.newUser.confirmPassword) {
                        const checkPasswordResponse = checkPassword(
                            this.newUser.password,
                            this.newUser.email
                        );
                        if (checkPasswordResponse.valid) {
                            if (this.checkTnC) {
                                this.processing = true;
                                this.initiateUserManagement(
                                    Object.assign({}, this.newUser, {
                                        password: btoa(this.newUser.password),
                                        confirmPassword: btoa(this.newUser.confirmPassword),
                                        contactNumber: this.selectedISDCode + this.newUser.contactNumber,
                                        email: this.newUser.email.toLowerCase(),
                                    })
                                )
                                    .then((r) => {
                                        this.reset();
                                        this.haveAccountConfirmCode = true;
                                        // @ts-ignore
                                        this.$notify(
                                            {
                                                group: "bottom",
                                                type: "info",
                                                title: "Info",
                                                text: r.message,
                                            },
                                            10000
                                        );
                                    })
                                    .catch((e) => {
                                        // On any error don't go back to login 
                                        // this.reset();
                                        this.processing = false;
                                        // @ts-ignore
                                        this.$notify(
                                            {
                                                group: "bottom",
                                                type: "error",
                                                title: "Error",
                                                text: e.data.message,
                                            },
                                            10000
                                        );
                                    });
                            } else {
                                // @ts-ignore
                                this.errorMessage = "Please accept the terms and conditions.";
                            }
                        } else {
                            // @ts-ignore
                            this.errorMessage = checkPasswordResponse.reason;
                        }
                    } else {
                        // @ts-ignore
                        this.errorMessage = "Password & Confirm password does not match.";
                    }
                } else {
                    // @ts-ignore
                    this.errorMessage = "Please select country.";
                }
            } else if (this.newUser.userSelection === "InitiateAuth") {
                if (this.selectedISDCode.length) {
                    this.processing = true;
                    this.initiateUserManagement(
                        Object.assign({}, this.newUser, {
                            password: btoa(this.newUser.password),
                            contactNumber: this.newUser.contactNumber.length
                                ? this.selectedISDCode + this.newUser.contactNumber
                                : "",
                            email: this.newUser.email.toLowerCase(),
                        })
                    )
                        .then(() => {
                            this.reset();
                            this.newUser.contactNumber = "";
                            this.newUser.password = "";
                            this.newUser.email = "";
                            this.$router.push({ name: "dashboard" });
                        })
                        .catch((e) => {
                            this.reset();
                            if (e.data.confirmationCodeNeeded) {
                                this.haveAccountConfirmCode = true;
                                // @ts-ignore
                                this.$notify(
                                    {
                                        group: "bottom",
                                        type: "info",
                                        title: "Info",
                                        text: e.data.message,
                                    },
                                    10000
                                );
                            } else if (e.data.emailConfirmationCodeNeeded) {
                                this.haveEmailConfirmCode = true;
                                // @ts-ignore
                                this.$notify(
                                    {
                                        group: "bottom",
                                        type: "info",
                                        title: "Info",
                                        text: e.data.message,
                                    },
                                    10000
                                );
                            } else {
                                // @ts-ignore
                                this.$notify(
                                    {
                                        group: "bottom",
                                        type: "error",
                                        title: "Error",
                                        text: e.data.message,
                                    },
                                    10000
                                );
                            }
                            if (!this.haveAccountConfirmCode && !this.haveEmailConfirmCode) {
                                this.newUser.contactNumber = "";
                                this.newUser.password = "";
                                this.newUser.email = "";
                            }
                        });
                } else {
                    // @ts-ignore
                    this.errorMessage = "Please select country.";
                }
            } else if (this.newUser.userSelection === "ForgetPassword") {
                if (this.selectedISDCode.length) {
                    this.processing = true;
                    this.initiateUserManagement(
                        Object.assign({}, this.newUser, {
                            contactNumber: this.newUser.contactNumber.length
                                ? this.selectedISDCode + this.newUser.contactNumber
                                : "",
                            email: this.newUser.email.toLowerCase(),
                        })
                    )
                        .then((r) => {
                            this.reset();
                            // @ts-ignore
                            this.$notify(
                                {
                                    group: "bottom",
                                    type: "info",
                                    title: "Info",
                                    text: r.message,
                                },
                                10000
                            );
                            if (r.forgetPasswordVerificationCodeNeeded) {
                                this.haveAccountConfirmCode = true;
                                this.newUser.userSelection = "ConfirmForgotPassword";
                            }
                        })
                        .catch((e) => {
                            this.reset();
                            // @ts-ignore
                            this.$notify(
                                {
                                    group: "bottom",
                                    type: "error",
                                    title: "Error",
                                    text: e.data.message,
                                },
                                10000
                            );
                        });
                } else {
                    // @ts-ignore
                    this.errorMessage = "Please select country.";
                }
            } else if (this.newUser.userSelection === "ConfirmForgotPassword") {
                if (this.selectedISDCode.length) {
                    if (this.newUser.password === this.newUser.confirmPassword) {
                        const checkPasswordResponse = checkPassword(
                            this.newUser.password,
                            this.newUser.email
                        );
                        if (checkPasswordResponse.valid) {
                            this.processing = true;
                            this.initiateUserManagement(
                                Object.assign({}, this.newUser, {
                                    password: btoa(this.newUser.password),
                                    confirmPassword: btoa(this.newUser.confirmPassword),
                                    contactNumber: this.newUser.contactNumber.length
                                        ? this.selectedISDCode + this.newUser.contactNumber
                                        : "",
                                    email: this.newUser.email.toLowerCase(),
                                })
                            )
                                .then((r) => {
                                    this.reset();
                                    // @ts-ignore
                                    this.$notify(
                                        {
                                            group: "bottom",
                                            type: "success",
                                            title: "Success",
                                            text: r.message,
                                        },
                                        10000
                                    );
                                })
                                .catch((e) => {
                                    // On any error don't go back to login 
                                    this.processing = false;
                                    // this.reset();
                                    // @ts-ignore
                                    this.$notify(
                                        {
                                            group: "bottom",
                                            type: "error",
                                            title: "Error",
                                            text: e.data.message,
                                        },
                                        10000
                                    );
                                });
                        } else {
                            // @ts-ignore
                            this.errorMessage = checkPasswordResponse.reason;
                        }
                    } else {
                        // @ts-ignore
                        this.errorMessage = "Password & Confirm password does not match.";
                    }
                }
            } else {
                // @ts-ignore
                this.errorMessage = "Please select country.";
            }
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (vm.$store.state.User.userData.loggedIn) {
                vm.$router.push({ name: "dashboard" });
            }
        });
    },
};
</script>
