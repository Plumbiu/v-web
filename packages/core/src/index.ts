import { readFileSync } from 'node:fs'
import readGlob from 'readdir-glob'
import { Sfcs } from '@v-web/shared'
import { formatName } from './utils/index.js'
import { parse } from './utils/parse.js'

export function transform(): Promise<Sfcs> {
	return new Promise((resolve) => {
		const result: Sfcs = {}
		const sfcs = readGlob('.', {
			pattern: '**/*.vue',
			skip: 'node_modules',
		})
		sfcs.on('match', (match: { relative: string; absolute: string }) => {
			const { relative, absolute } = match
			const fileContent = readFileSync(absolute)
			result[formatName(relative)] = {
				__path__: absolute,
				__content__: fileContent.toString(),
			}
		})
		sfcs.on('end', () => {
			parse(result)
			resolve(result)
		})
	})
}
