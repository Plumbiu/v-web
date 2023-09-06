import { createServer } from 'node:http'
import { writeFileSync } from 'node:fs'
import { transform } from '@v-web/core'
import { WebSocketServer } from 'ws'

export async function startServer() {
	const server = createServer()
	const sfc = await transform()
	const wss = new WebSocketServer({ server })
	wss.on('connection', (ws) => {
		ws.send('world')
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ws.on('message', (e: any) => {
			const data = JSON.parse(e.toString())
			const { type, path, content, name } = data
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

startServer()
