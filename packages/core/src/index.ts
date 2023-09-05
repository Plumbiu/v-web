/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { Parser } from 'acorn'
import tsPlugin from 'acorn-typescript'
import { simple as walk } from 'acorn-walk'
import readGlob from 'readdir-glob'
import { SfcInfo } from 'packages/shared'

const scriptReg = /<script[\s\w="']+>/

function parse(p: string) {
	const content = readFileSync(path.resolve(p), 'utf-8')
	let script = ''
	if (scriptReg.test(content)) {
		script = content.slice(
			content.match(/<script[\s\w="']+>/)![0].length,
			content.lastIndexOf('</script>'),
		)
	}
	const ast = Parser.extend(tsPlugin() as any).parse(script, {
		ecmaVersion: 'latest',
		sourceType: 'module',
	})
	const result: Record<string, string> = {}
	walk(ast, {
		ImportDeclaration(node: any) {
			const { source } = node
			const name = source.value
			if (name?.endsWith('.vue')) {
				result[name.slice(name.lastIndexOf('/') + 1)] = p
			}
		},
	})
	return result
}

export function transform() {
	return new Promise((resolve) => {
		const result: SfcInfo = {}
		const sfcs = readGlob('.', {
			pattern: '**/*.vue',
		})
		sfcs.on('match', (match: { relative: string; absolute: string }) => {
			const { relative, absolute } = match
			const fileContent = readFileSync(absolute)
			const name = relative.slice(relative.lastIndexOf('/') + 1)
			const child = parse(absolute)
			if (child)
				result[name] = {
					...child,
					__path__: absolute,
					__content__: fileContent.toString(),
				}
		})
		sfcs.on('end', () => {
			resolve(result)
		})
	})
}
