<template>
<div class="songs">
  <div class="background">
    <div class="pic-word">
      <img :src="menuInfo.coverImgUrl" alt="加载失败！">
      <div class="word">
        <span class="name">{{ menuInfo.name }}</span>
        <span class="description">{{ menuInfo.description }}</span>
      </div>
    </div>
    <div class="other">
      <button><van-icon name="share-o" color="#ffffff" size="24"/>&nbsp;{{ menuInfo.shareCount }}</button>
      <button><van-icon name="chat-o" color="#ffffff" size="24"/>&nbsp;{{ menuInfo.commentCount }}</button>
      <button class="red"><van-icon name="send-gift-o" color="#ffffff" size="24"/>&nbsp;{{ menuInfo.subscribedCount }}</button>
    </div>
  </div>
  <div class="content">
    <div class="song" v-for="(item, index) in songs" :key="index" @click="bofang(item.id)">
      <span>{{ index + 1 }}</span>
      <div class="detail" @click="play(item)">
        <span class="name">{{ item.name }}</span>
        <span class="des">{{ item.ar[0].name }}—{{ item.al.name }}</span>
      </div>
      <span><van-icon name="ellipsis" /></span>
    </div>
  </div>
</div>
</template>

<script setup>
// 歌单页面
import { getAllSongs, getMenuDetail } from '@/utils/api/search';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { play } from '@/utils/method/common'

let menuInfo = ref({})
let songs = ref([])

const route = useRoute()
// console.log(route.params, 'router');

onMounted(async () => {
  const id = route.params.id
  // 歌单详情
  const menuDetail = await getMenuDetail({id})
  menuInfo.value = menuDetail.data.playlist

  console.log(menuInfo, 'menuInfo');


  // 歌单所有歌曲
  const allSongs = await getAllSongs({id})
  songs.value = allSongs.data.songs
  console.log(allSongs, 'allSongs');
})



  // 获取播放歌曲的url
  const bofang = (id) => {

  }
</script>

<style lang='less' scoped>
.songs {
  width: 100%;
  height: 85vh;
  background-image: linear-gradient(to left bottom, rgb(88, 62, 62), rgb(160, 95, 95));

  .background {
    background-image: linear-gradient(to left bottom, rgb(88, 62, 62), rgb(160, 95, 95));
    width: 100%;
    height: 50vw;

    .pic-word {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 35vw;

      img {
        margin: 10px;
        border-radius: 10%;
        width: 30%;
        // height: 30px;
      }

      .word {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: #fff;
        height: 35vw;
        overflow: hidden;
        .name {
        font-size: 20px;
        font-weight: bold;
        overflow: hidden;
        height: 15vw;

        .description {
          font-size: 12px;
          height: 20vw;
          transform: scale(0.8);
          overflow: hidden;
        }
      }
      }
    }

    .other {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 15vw;

      button {
        border: 0;
        border-radius: 19px;
        box-shadow: none;
        width: 30%;
        height: 38px;
        background-color: rgb(236, 196, 196);
        outline: none;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 38px;

        
      }
      .red {
          background-color: red;
        }
    }
  }

  .content {
    padding-top: 5vw;
    width: 100%;
    min-height: 110vw;
    border-radius: 5vw 5vw 0 0;
    background-color: #fff;

    .song {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 15vw;
      // background-color: pink;

      span {
        flex: 1
      }

      .detail {
        flex: 5;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;

        .des {
          font-size: 12px;
        }
      }
    }
  }
}
</style>