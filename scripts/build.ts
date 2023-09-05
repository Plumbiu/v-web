import * as esbuild from 'esbuild'
import { copy } from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function resolveBuild() {
	await esbuild.build({
		entryPoints: ['packages/cli/index.ts'],
		outdir: 'packages/cli/dist',
		bundle: true,
		minify: true,
		treeShaking: true,
		platform: 'node',
		format: 'esm',
		banner: {
			js: `#! /usr/bin/env node
			import { createRequire as topLevelCreateRequire } from 'module';
			const require = topLevelCreateRequire(import.meta.url);
			`,
		},
	})
	await build({
		root: path.resolve(__dirname, '../packages/web'),
		build: {
			copyPublicDir: false,
		},
	})
	await copy(
		path.resolve(__dirname, '../packages/web/dist'),
		path.resolve(__dirname, '../packages/cli/dist'),
	)
}

resolveBuild()
