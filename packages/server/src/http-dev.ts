import { createServer } from 'node:http'
import { writeFileSync } from 'node:fs'
import { Server } from 'socket.io'

export async function startServer() {
	const server = createServer()
	const io = new Server(server)
	io.on('connect', (socket) => {
		socket.on('change', ({ __path__, __content__ }) => {
			try {
				writeFileSync(__path__, __content__)
			} catch (err) {
				/* empty */
			}
		})
	})
	server.listen(3003)
}

startServer()
