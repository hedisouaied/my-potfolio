import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // GitHub Pages project sites live under a sub-path, so production builds need the
  // prefix. Dev serves from the root instead, otherwise vite will not hand out index.html.
  base: command === 'build' || isPreview ? '/my-potfolio/' : '/',
}))