/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path'
import { Parser } from 'acorn'
import tsPlugin from 'acorn-typescript'
import { simple as walk } from 'acorn-walk'
import { readFileSync } from 'node:fs'
import { formatName } from './index.js'

const scriptReg = /<script[\s\w="']+>/

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
	try {
		const ast = Parser.extend(tsPlugin() as any).parse(script, {
			ecmaVersion: 'latest',
			sourceType: 'module',
		})
		walk(ast, {
			ImportDeclaration(node: any) {
				const { source } = node
				const name = source.value
				if (name?.endsWith('.vue')) {
					result[formatName(name)] = p
				}
			},
		})
	} catch (err) {
		/* empty */
	}

	return result
}
