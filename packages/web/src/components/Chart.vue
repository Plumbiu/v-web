<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts from '../echarts/index'
import { Codemirror } from 'vue-codemirror'
import type { SfcInfo } from '@v-web/shared'
import { vue } from '@codemirror/lang-vue'
import { Link, Node } from '../types'
import Demo from './Demo/index.vue'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3003', {
	transports: ['websocket', 'polling', 'flashsocket']
})

socket.on('refresh', (data: SfcInfo) => {
	sfcInfo.value = data
})

const dataJson = await fetch('sfc.json')
const sfcInfo = ref<SfcInfo>(await dataJson.json())
const sfcName = ref('')
const code = ref('')
const info = ref<any>()

onMounted(() => {
	const nodes: Node[] = []
	const links: Link[] = []
	for (const [name, val] of Object.entries(sfcInfo.value)) {
		nodes.push({
			name,
			value: val.__path__,
		})
		for (const key of Object.keys(val)) {
			if (key !== '__path__') {
				links.push({ source: name, target: key })
			}
		}
	}
	const options: any = {
		series: {
			type: 'graph',
			layout: 'force',
			nodes,
			links,
			categories: [{ name: '依赖' }, { name: '项目依赖' }, { name: '项目名' }],
			cursor: 'pointer',
			symbolSize: 22,
			label: {
				show: true,
				position: 'top',
			},
			force: {
				repulsion: 900,
				friction: 0.15,
			},
			roam: true,
			draggable: true,
		},
	}
	const chart = echarts.init(document.getElementById('chart'))
	chart.setOption(options)
	chart.on('click', (params: any) => {
		const { data } = params
		sfcName.value = data.name
		code.value = sfcInfo.value[data.name].__content__
		info.value = sfcInfo.value[data.name]
	})
})

function handleUpdate() {
	socket.emit('change', { ...info.value, __content__: code.value, name: sfcName.value } )
}
</script>

<template>
	<div style="display: flex" @keyup.alt.enter="handleUpdate">
		<div id="chart" style="height: 100vh; width: 50%" />
		<codemirror
			v-model="code"
			placeholder="Code goes here..."
			:style="{ height: '100vh', flex: 1 }"
			:autofocus="true"
			:indent-with-tab="true"
			:tab-size="2"
			:extensions="[vue()]"
		/>
	</div>
	<Demo />
</template>

<style scoped></style>
