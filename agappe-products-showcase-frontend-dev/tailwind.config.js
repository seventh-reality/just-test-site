module.exports = {
    mode: "jit",
    purge: [
        "./src/**/*.html",
        "./public/**/*.html",
        "./src/**/*.{js,jsx,ts,tsx,vue}",
    ],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                arial: "Arial"
            },
            spacing: {
                "18": "4.5rem",
                "22": "5.5rem",
                "26": "6.5rem",
                "30": "7.5rem",
                "42": "10.5rem",
                "54": "13.5rem",
            }
        },
    },
    variants: {
        animation: ["responsive", "motion-safe", "motion-reduce"],
        aspectRatio: ["responsive", "hover"],
        extend: {
            textOpacity: ["dark"],
            visibility: ["hover", "focus"],
            animation: ["hover", "focus"],
            fontFamily: ["hover", "focus"],
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
    ],
};
