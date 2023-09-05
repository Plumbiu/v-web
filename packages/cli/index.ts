import { cac } from 'cac'
import { startServer } from './src'

const cli = cac('vo')

cli.command('s').action(() => {
	startServer()
})

cli.parse()
