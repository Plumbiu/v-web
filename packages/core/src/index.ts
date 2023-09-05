import { readFileSync } from 'node:fs'
import readGlob from 'readdir-glob'
import { SfcInfo } from 'packages/shared'
import { formatName } from './utils/index.js'
import { parse } from './utils/parse.js'

export function transform(): Promise<SfcInfo> {
	return new Promise((resolve) => {
		const result: SfcInfo = {}
		const sfcs = readGlob('.', {
			pattern: '**/*.vue',
			skip: 'node_modules',
		})
		sfcs.on('match', (match: { relative: string; absolute: string }) => {
			const { relative, absolute } = match
			const fileContent = readFileSync(absolute)
			const child = parse(absolute)
			if (child)
				result[formatName(relative)] = {
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
