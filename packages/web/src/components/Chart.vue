<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts from '../echarts/index'
import { Codemirror } from 'vue-codemirror'
import type { SfcInfo } from '@vue-online/shared'
import { vue } from '@codemirror/lang-vue'
import { Link, Node } from '../types';

const dataJson = await fetch('sfc.json')
const sfcInfo: SfcInfo = await dataJson.json()
const code = ref(sfcInfo['App.vue'].__content__)

onMounted(() => {
  const nodes: Node[] = []
  const links: Link[] = []
  for(const [name, val] of Object.entries(sfcInfo)) {
    nodes.push({
      name,
      value: val.__path__
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
      categories: [
        { name: '依赖' },
        { name: '项目依赖' },
        { name: '项目名' },
      ],
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
    code.value = sfcInfo[data.name].__content__
  })
})
</script>

<template>
  <div style="display: flex;">
    <div id="chart" style="height: 100vh;width: 50%;" />
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

<style scoped>

</style>
