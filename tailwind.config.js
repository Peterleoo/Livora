/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Manrope', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#137fec',
                    dark: '#0b5cb5',
                    light: '#e0f0ff',
                },
                secondary: '#6366f1',
                dark: {
                    bg: '#101922',
                    surface: '#1e2936',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateY(0%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            }
        },
    },
    plugins: [],
}
