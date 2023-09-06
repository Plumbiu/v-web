import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'
import { transform } from '../packages/core/src/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createViteServer() {
	const server = await createServer({
		configFile: path.resolve(__dirname, '../packages/web/vite.config.ts'),
		root: path.resolve(__dirname, '../packages/web'),
	})
	const fileContent = await transform()
	fs.writeFileSync(
		path.resolve(__dirname, '../packages/web/public/sfc.json'),
		JSON.stringify(fileContent),
	)
	await server.listen()
	server.printUrls()
}

await createViteServer()
