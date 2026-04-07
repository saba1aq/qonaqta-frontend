import path from "path"
import { defineConfig, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export function createViteConfig(appDir: string, overrides?: Partial<UserConfig>) {
  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(appDir, "./src"),
      },
    },
    ...overrides,
  })
}
