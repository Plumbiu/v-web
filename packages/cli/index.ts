import { cac } from 'cac'
import { startServer } from '@vue-sfc-online/server'
import { logWebStart } from './src/logger.js'

const cli = cac('vo')

cli.command('s').action(async () => {
	await startServer()
	logWebStart()
})

cli.parse()
