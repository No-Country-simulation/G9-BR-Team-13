/**
 * Arquivo de configuração do bundler Vite.
 * Configura os plugins do React e do Tailwind CSS (versão 4) para compilação e desenvolvimento.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});