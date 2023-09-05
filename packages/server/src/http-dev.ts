import { createServer } from 'node:http'
import { writeFileSync } from 'node:fs'
import { Server } from 'socket.io'
import { transform } from '@v-web/core'

export async function startServer() {
	const server = createServer()
	const sfc = await transform()
	const io = new Server(server)
	io.on('connect', (socket) => {
		socket.on('change', async ({ path, content, name }) => {
			if (!path || !content) return
			writeFileSync(path, content)
			sfc[name].__content__ = content
			socket.emit('refresh', sfc)
		})
	})
	server.listen(3003)
}

startServer()
