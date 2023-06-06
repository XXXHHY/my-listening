<template>
  <van-nav-bar 
  :title="title" 
  fixed 
  placeholder
  @click-left="back"
  @click-right="menu">
    <template #left>
      <van-icon name="arrow-left" size="18"></van-icon>
    </template>
    <template #right>
      <van-icon name="apps-o" size="18" />
    </template>
  </van-nav-bar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const title = ref('首页')

const route = useRoute()
const router = useRouter()

// 监听路由的变化改变top中的标题
watch(() => route.meta.title, (newVal, oldVal) => {
  // console.log(newVal, oldVal, 'watch');
  if(newVal == title) return
  else {
    title.value = newVal
  }
}, {
  immediate: true
})

// 顶部的handle
const back = () => {
  if(route.meta.title == '首页') return
  router.back()
}

const menu = () => {

}
</script>

<style lang='less' scoped></style>