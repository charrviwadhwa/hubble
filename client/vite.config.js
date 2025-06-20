import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

   theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],        // for body
        heading: ['Sora', 'sans-serif'], 
        serifDisplay: ['"DM Serif Display"', 'serif'],     // for headings
      },
    },
  },
  plugins: [react(),
     tailwindcss()
  ],
  
})
