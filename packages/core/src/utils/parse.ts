import path from 'node:path'
import { readFileSync } from 'node:fs'

const scriptReg = /<script[\s\w="']+>/
const vueImportReg = /import ([\w]*) from '([@./\w]*.vue)'/

export function parse(p: string) {
	const content = readFileSync(path.resolve(p), 'utf-8')
	let script = ''
	if (scriptReg.test(content)) {
		script = content.slice(
			content.match(/<script[\s\w="']+>/)![0].length,
			content.lastIndexOf('</script>'),
		)
	}
	const result: Record<string, string> = {}
	const tokens = vueImportReg.exec(script)

	if (tokens) result[`${tokens[1]}.vue`] = p
	return result
}
