import { createViteConfig } from "@qonaqta/config-vite"

export default createViteConfig(__dirname, {
  server: { port: 5175 },
})
