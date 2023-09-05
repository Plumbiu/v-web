import colors from 'picocolors'
import { version } from '../package.json'

function logLogo() {
	console.log(
		`\n  ${colors.green(colors.bold('v-web'))}   ${colors.dim(
			`v${version}`,
		)}\n`,
	)
}

export function logWebStart() {
	logLogo()
	console.log(`  ${colors.cyan('http://localhost:3003')}\n`)
}
