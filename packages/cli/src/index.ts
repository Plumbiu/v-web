import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from '@vue-online/core'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function startServer() {
	const html = readFileSync(path.resolve(__dirname, './index.html.br'))
	const sfc = await transform()
	const server = createServer((req, res) => {
		if (req.url === '/') {
			console.log(req.url)
			res.setHeader('content-encoding', 'br')
			res.end(html)
		} else if (req.url === '/sfc.json') {
			res.end(JSON.stringify(sfc))
		}
	})
	server.listen(3003, () => {
		console.log('server is running at http://localhost:3003')
	})
}
