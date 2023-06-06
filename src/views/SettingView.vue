<template>
{{ num }}
<button @click="add">+1</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { lyric } from '@/utils/api/home'
import { lyricFormat } from '@/utils/method/common'

const num = ref(0)

const add = () => {
  num.value += 1
  console.log(num, 'num')
}

onMounted(async () => {
  const data = await lyric({id: 33894312})
  // console.log(data, '歌词');
  const result = lyricFormat(data.data.lrc.lyric)
  console.log(result, 'result');
})
</script>

<style lang='less' scoped>

</style>