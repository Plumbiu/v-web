import type { Sfcs } from '@v-web/shared'

export function parse(result: Sfcs) {
	function parseScript(content: string, root: string) {
		const scriptReg = /<script[\s\w="']*>/
		const vueImportReg = /import ([\w]*) from '[@./\w]*.vue'/g
		let script = ''
		if (scriptReg.test(content)) {
			script = content.slice(
				content.match(/<script[\s\w="']+>/)![0].length,
				content.lastIndexOf('</script>'),
			)
		}
		let m
		while ((m = vueImportReg.exec(script))) {
			console.log(m)
			result[root][m[0]] = result[m[0]]?.__path__
		}
	}

	function parseTemplate(content: string, root: string) {
		const template = content.slice(
			content.indexOf('<template>'),
			content.lastIndexOf('</template>'),
		)
		const componentReg1 = /<([A-Z][\w]+).+>/g
		const componentReg2 = /<([a-z\w]*-[\w]+).+/g

		let m
		const componentInside = new Set([
			'Transition',
			'TransitionGroup',
			'KeepAlive',
			'Teleport',
			'Suspense',
		])
		while ((m = componentReg1.exec(template)?.[1])) {
			if (m && !componentInside.has(m)) {
				result[root][m] = result[m]?.__path__
			}
		}
		while ((m = componentReg2.exec(template)?.[1])) {
			if (m && !componentInside.has(m)) {
				result[root][m] = result[m]?.__path__
			}
		}
	}
	for (const [key, { __content__: content }] of Object.entries(result)) {
		parseScript(content, key)
		parseTemplate(content, key)
	}
}
