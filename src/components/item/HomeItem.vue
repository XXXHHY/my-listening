<template>
  <div class="homeItem">
    <div class="title">
      <span>推荐歌单</span>
      <van-icon name="arrow" size="18" />
    </div>
    <div class="content">
      <div class="box" v-for="item in realData" :key="item.resourceId">
        <img class="img" :src="item.uiElement.image.imageUrl" @click="turn(item.resourceId)" alt="加载失败">
        <span class="word">{{ item.uiElement.mainTitle.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
// const store = useStore()
// const home = store.getters.getRecommend

const props = defineProps({
  homeRecommend: Array
})

const isEmpty = computed(() => {
  if(props.homeRecommend) { // 如果有值就返回false，不为空
    return false
  }else {
    return true
  }
})

const show = props.homeRecommend
const showData = show[0]

const real = toRaw(showData)

const realData = real.resources


const router = useRouter()
const turn = (id) => {
  router.push({
    name: 'menu',
    params: {
      id
    }
  })
}




</script>

<style lang='less' scoped>
.homeItem {
  width: 100%;
  height: 200px;
  // background-color: pink;

  .title {
    padding-left: 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 30px;
    // background-color: blue;
  }

  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 170px;

    .box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 30%;
      height: 150px;
      // background-color: red;
      overflow-x: auto;

      .img {
        border-radius: 5%;
        margin: 10px;
        width: 90%;
        height: 60%;
        object-fit: cover;
      }

      .word {
        font-size: 6px;
      }
    }
  }
}
</style>