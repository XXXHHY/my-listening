<template>
  <van-collapse v-model="activeNames">
    <van-collapse-item title="筛选" name="1">
      <div class="type">
        <span v-for="item in type" :key="item.id" :class="{active: currentType == item.id}" @click="changeType(item.id)">{{ item.name }}</span>
      </div>
      <div class="area">
        <span v-for="item in area" :key="item.id" :class="{active: currentArea == item.id}" @click="changeArea(item.id)">{{ item.name }}</span>
      </div>
    </van-collapse-item>
  </van-collapse>

  <div class="artists">
    <li v-for="item in artistsList" :key="item.id" @click="turn(item.id)">
      <div>
        <div class="img">
          <img :src="item.picUrl" alt="">
        </div>
        <span>{{ item.name }}</span>
      </div>
      <span>搜索</span>
    </li>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { artists } from '@/utils/api/home'
import { useRouter } from 'vue-router'

const activeNames = ref(['1'])
// 一、以下是切换高亮显示
const type = ref([
  {id: -1, name: '全部'},
  {id: 1, name: '男歌手'},
  {id: 2, name: '女歌手'},
  {id: 3, name: '乐队'},
])

const area = ref([
  {id: -1, name: '全部'},
  {id: 7, name: '华语'},
  {id: 96, name: '欧美'},
  {id: 8, name: '日本'},
  {id: 16, name: '韩国'},
  {id: 0, name: '其他'},
])

const currentType = ref(-1)
const currentArea = ref(-1)

const changeType = (id) => {
  if(currentType !== id) {
    currentType.value = id
  }
}

const changeArea = (id) => {
  if(currentArea !== id) {
    currentArea.value = id
  }
}

// 二、watch监听筛选内容调用artists这个api请求数据
const artistsList = ref([]) // 歌手数据
watch([currentType, currentArea], async (newVal, oldVal) => {
  if(newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
    const artistsData = await artists({
      type: newVal[0],
      area: newVal[1]
    })
    console.log(artistsData, 'artistsData');
    artistsList.value = artistsData.data.artists
  }
}, {
  immediate: true
})

// 三、点击跳转到歌单页面并传递歌手数据
const router = useRouter()
const turn = (id) => {
  router.push({
    name: 'artist_detail',
    params: {
      id
    }
  })
}
</script>

<style lang='less' scoped>
.type, .area {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2% 5%;
  width: 100%;

  span {
    margin-right: 5%;
  }
}

.active {
  color: rgb(61, 161, 201);
}

.artists {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    margin: 2% 0;
    list-style: none;
    width: 100%;
    height: 18vw;
    // background-color: pink;

    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 60vw;
      
      .img {
        margin-right: 5%;
        border-radius: 50%;
        width: 16vw;
        height: 16vw;
        overflow: hidden;

        img {
          width: 16vw;
          height: 16vw;
        }
      }
    }
  }
}
</style>