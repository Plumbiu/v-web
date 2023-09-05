<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts, { options } from '../echarts/index'
import { Codemirror } from 'vue-codemirror'
import type { SfcInfo, Sfc } from '@v-web/shared'
import { vue } from '@codemirror/lang-vue'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3003', {
	transports: ['websocket', 'polling', 'flashsocket'],
})

socket.on('refresh', (data: SfcInfo) => {
	sfcInfo.value = data
})

const dataJson = await fetch('sfc.json')
const sfcInfo = ref<SfcInfo>(await dataJson.json())
const code = ref('')
let info: Partial<Sfc> = {}
let sfcName = ''

function handleUpdate() {
	if (info) {
		socket.emit('change', {
			path: info.__path__,
			content: code.value,
			name: sfcName,
		})
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
			:style="{ height: '100vh', flex: 1 }"
			:autofocus="true"
			:indent-with-tab="true"
			:tab-size="2"
			:extensions="[vue()]"
		/>
	</div>
</template>

<style scoped></style>
