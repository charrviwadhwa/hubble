import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

   theme: {
    extend: {
      fontFamily: {
                // for body
        heading: ['Sora', 'sans-serif'], 
        serifDisplay: ['"Playfair Display"', 'serif'],    // for headings
      },
    },
  },
  plugins: [react(),
     tailwindcss()
  ],
  
})
