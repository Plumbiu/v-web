import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from '@vue-sfc-online/core'
import { Server } from 'socket.io'
import { writeFileSync } from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

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
	const io = new Server(server)
	io.on('connect', (socket) => {
		socket.on('change', async ({ __path__, __content__, name }) => {
			try {
				writeFileSync(__path__, __content__)
			} catch (err) {
				/* empty */
			}
			sfc[name] = {
				...sfc[name],
				__content__,
			}
			socket.emit('refresh', sfc)
		})
	})
	server.listen(3003)
}
