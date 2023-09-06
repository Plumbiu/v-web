<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts, { options } from '../echarts/index'
import { Codemirror } from 'vue-codemirror'
import type { Sfcs, Sfc } from '@v-web/shared'
import { vue } from '@codemirror/lang-vue'
import { oneDark } from '@codemirror/theme-one-dark'

const dataJson = await fetch('sfc.json')
const sfcInfo = ref<Sfcs>(await dataJson.json())
const code = ref('')
let info: Partial<Sfc> = {}
let sfcName = ''
const ws = new WebSocket('ws://localhost:3003')

ws.onmessage = (e) => {
	const { type, sfc } = e.data
	if (type === 'refresh') {
		sfcInfo.value = sfc
	}
}

function handleUpdate() {
	if (info) {
		ws.send(JSON.stringify({
			type: 'change',
			path: info.__path__,
			content: code.value,
			name: sfcName,
		}))
	}
}

onMounted(() => {
	const chart = echarts.init(document.getElementById('chart'))
	chart.setOption(options(sfcInfo.value))
	chart.on('click', ({ data }: any) => {
		const { name } = data
		sfcName = name
		info = sfcInfo.value[name]
		code.value = sfcInfo.value[name].__content__
	})
})
</script>

<template>
	<div style="display: flex" @keyup.alt.enter="handleUpdate">
		<div id="chart" style="height: 100vh; width: 50%" />
		<codemirror
			v-model="code"
			placeholder="Code goes here..."
			:style="{ height: '100vh', flex: 1, fontSize: '18px' }"
			:autofocus="true"
			:indent-with-tab="true"
			:tab-size="2"
			:extensions="[vue(), oneDark]"
		/>
	</div>
</template>
