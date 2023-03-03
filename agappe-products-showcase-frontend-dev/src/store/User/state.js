export const state = () => ({
    userData: {
        id: null,
        name: null,
        email: null,
        contactNumber: null,
        accessToken: null,
        refreshToken: null,
        loggedIn: false,
        isAdmin: false,
        loggedInTime: null
    },
    loaderData: {
        loading: false,
        type: "info",
        size: "sm"
    },
    modalData: {
        isOpen: false,
        content: null,
        type: "image",
        url: null,
        name: null,
    },
    fsMode: false,
    watchingTimeOver: false
});