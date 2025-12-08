import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command }): UserConfig => {
  const isDev = command === 'serve'
  
  return {
    plugins: [react()],

    // Permite acessar sua lib local
    server: isDev
    ? {
      fs: {
        allow: [
          // raiz do projeto (ajuste se seu vite estiver em subpasta)
          path.resolve(__dirname),
          // pasta da lib (ajuste se necessário)
          path.resolve(__dirname, '../website-lib'),
        ]
      }
    } : undefined,

    // (opcional, mas recomendado) alias para não usar caminhos relativos
    resolve: {
      alias: isDev
      ? {
        'website-lib': path.resolve(__dirname, '../website-lib/dist')
        // ou '../website-lib/src' se quiser apontar pro código fonte
      } : {}
    },

    // Ajuda o Vite a pré-bundlar dependências importadas pela lib
    optimizeDeps: {
      include: ['dompurify', 'react-input-mask']
    }
  }
})
