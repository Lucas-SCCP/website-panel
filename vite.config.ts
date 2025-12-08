import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Permite acessar sua lib local
  server: {
    fs: {
      allow: [
        // raiz do projeto (ajuste se seu vite estiver em subpasta)
        path.resolve(__dirname),
        // pasta da lib (ajuste se necessário)
        path.resolve(__dirname, '../website-lib'),
      ]
    }
  },

  // (opcional, mas recomendado) alias para não usar caminhos relativos
  resolve: {
    alias: {
      'website-lib': path.resolve(__dirname, '../website-lib/dist')
      // ou '../website-lib/src' se quiser apontar pro código fonte
    }
  },

  // Ajuda o Vite a pré-bundlar dependências importadas pela lib
  optimizeDeps: {
    include: ['dompurify', 'react-input-mask']
  }
})
