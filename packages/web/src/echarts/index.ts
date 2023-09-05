import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { Link, Node } from '../types'
import type { SfcInfo } from '@v-web/shared'

echarts.use([GraphChart, CanvasRenderer])

export default echarts

export function options(sfcInfo: SfcInfo) {
	const nodes: Node[] = []
	const links: Link[] = []
	for (const [name, val] of Object.entries(sfcInfo)) {
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
	return {
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
}
