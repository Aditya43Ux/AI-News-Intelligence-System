/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                glow: '0 0 30px rgba(6, 182, 212, 0.25)',
            },
        },
    },
    plugins: [],
};
