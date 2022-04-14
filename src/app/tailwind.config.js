module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        colors: {
            // Text
            emphasis: "#151a22ff",
            medium: "#151a22b3",
            disabled: "#151a2266",

            // Backgrounds

            white: "#ffffff",

            bkg: {
                light: "#f5f5f5",
                dark: "#1e293b",
            },

            // Accent colors

            // primary: {
            //     light: "#82e9de",
            //     normal: "#4db6ac",
            //     dark: "#00867d",
            //     text: "#000000",
            // },
            primary: {
                light: "#B7E4F8",
                normal: "#6EC9F2",
                dark: "#0ea5e9",
                text: "#000000",
            },

            secondary: {
                light: "#00000000",
                normal: "#00000009",
                dark: "#0000003d",
                text: "#000000",
            },
        },

        fontFamily: {
            sans: [
                "Segoe UI",
                "Roboto",
                "Oxygen",
                "Ubuntu",
                "Cantarell",
                "Fira Sans",
                "Droid Sans",
                "Helvetica Neue",
                "sans-serif",
            ],
        },

        extend: {},
    },
    plugins: [],
};
