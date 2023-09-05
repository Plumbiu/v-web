import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { compression } from 'vite-plugin-compression2'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		viteSingleFile(),
		compression({
			algorithm: 'brotliCompress',
			deleteOriginalAssets: true,
		}),
	],
	build: {
		copyPublicDir: false,
	},
})
