import { cac } from 'cac'
import { startServer } from '@v-web/server'
import { logWebStart } from '@v-web/shared'

const cli = cac('vw')

cli
	.command('[root]', 'start web server')
	.alias('server')
	.alias('s')
	.action(async () => {
		await startServer()
		logWebStart()
	})

cli.parse()
