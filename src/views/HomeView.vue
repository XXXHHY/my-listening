<template>
  <!-- 轮播图 -->
  <van-swipe :autoplay="3000" lazy-render>
    <van-swipe-item v-for="image in banners" :key="image.bannerId">
      <img class="swipe-pic" :src="image.pic" />
    </van-swipe-item>
  </van-swipe>

  <!-- 一个小菜单 -->
  <van-grid clickable :column-num="3">
    <van-grid-item icon="bar-chart-o" text="排行榜" to="/songmenu" />
    <van-grid-item icon="user-circle-o" text="歌手" to="/artist" />
    <van-grid-item icon="ellipsis" text="更多" />
  </van-grid>

  <!-- 推荐歌单 -->
  <HomeItem :homeRecommend="homeRecommend" v-if="homeRecommend.length > 0"></HomeItem>
  <div>hhh</div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex';
import { homepage, topList, highquality } from '@/utils/api/home';
import HomeItem from '@/components/item/HomeItem.vue'
// 定义一个首页数据的对象
let banners = ref([])

let homeRecommend = ref([])

// 定义一个首页推荐歌单的随机序号
const ranIndex = ref(parseInt(Math.random()*6))

const store = useStore()

onBeforeMount(async () => {
  // 判断是否已经有缓存banners
  if (!store.state.home.hasData) { // 没有缓存
    // 获取首页数据
    const HomeData = await homepage()
    // console.log(HomeData, 1111);
    // 缓存至vuex并保存在本页面渲染
    banners.value = HomeData.data.data.blocks[0].extInfo.banners // 轮播图
    homeRecommend.value = HomeData.data.data.blocks[1].creatives // 首页推荐
    // console.log(banners, homeRecommend, 999);

    store.commit('setHomeData', {banners, homeRecommend})
  }else { // 已经缓存过了，直接从vuex中提取
    banners.value = store.state.home.banners
    homeRecommend.value = store.state.home.homeRecommend
  }

  // 首页推荐歌单
  // const homeSongMenu = HomeData.data.data.blocks[1].creatives
  // console.log(HomeData, 33333);


  

  const highqualityData = await highquality()
  // console.log(highqualityData, 22222); 
})



</script>

<style lang="less">
.swipe-pic {
  border-radius: 5%;
  margin: 10px;
  width: 90%;
  height: 10%;
  object-fit: cover;
}
</style>