import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from '@v-web/core'
import { writeFileSync } from 'node:fs'
import { WebSocketServer } from 'ws'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

interface ClientChangeMessage extends ClientMessage {
	type: 'change'
	path: string
	content: string
	name: string
}

interface ClientMessage {
	type: string
}

export async function startServer() {
	const html = readFileSync(path.resolve(__dirname, './index.html.br'))
	const sfc = await transform()
	const server = createServer((req, res) => {
		if (req.url === '/') {
			res.setHeader('content-encoding', 'br')
			res.end(html)
		} else if (req.url === '/sfc.json') {
			res.end(JSON.stringify(sfc))
		}
	})
	const wss = new WebSocketServer({ server })
	wss.on('connection', (ws) => {
		ws.on('message', (e: Buffer) => {
			const data: ClientChangeMessage = JSON.parse(e.toString())
			const { type, path, content, name } = data
			if (!path || !content || !name || !type) return
			if (type === 'change') {
				writeFileSync(path, content)
				sfc[name].__content__ = content
				ws.send(
					JSON.stringify({
						type: 'refresh',
						sfc,
					}),
				)
			}
		})
	})
	server.listen(3003)
}
