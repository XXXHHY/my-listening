<template>
  <van-tabbar v-model="active" route fixed placeholder>
    <van-tabbar-item to="/" name="home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/search" name="search" icon="search">搜索</van-tabbar-item>
    <van-tabbar-item to="/music" name="friends" icon="music-o">音乐</van-tabbar-item>
    <van-tabbar-item to="/setting" name="setting" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>

import { ref } from 'vue';
const active = ref('home');


</script>

<style lang='less' scoped></style>