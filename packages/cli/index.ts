import { cac } from 'cac'
import { startServer } from '@vue-web/server'
import { logWebStart } from './src/logger.js'

const cli = cac('vw')

cli.command('s').action(async () => {
	await startServer()
	logWebStart()
})

cli.parse()
