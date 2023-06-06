<template>
  <div class="songs">
    <div class="background">
      <img :src="cover" alt="">
    </div>
    <div class="content">
      <div class="info">
        <span class="name1">{{ name1 }}</span>
        <span class="name2">{{ name2 }}</span>
        <span class="fans">977.2万 粉丝</span>
        <span class="shenfen">{{ shenfen }}</span>
      </div>
      <van-tabs v-model:active="activeName" animated>
        <van-tab title="主页" name="a">内容还在制作~~</van-tab>
        <van-tab title="歌曲" name="b">
          <div class="song" v-for="(item, index) in songs" :key="index" @click="bofang(item.id)">
            <span>{{ index + 1 }}</span>
            <div class="detail" @click="play(item)">
              <span class="name">{{ item.name }}</span>
              <span class="des">{{ item.ar[0].name }}—{{ item.al.name }}</span>
            </div>
            <span><van-icon name="ellipsis" /></span>
          </div>
        </van-tab>
        <van-tab title="专辑" name="c">内容还在制作~~</van-tab>
        <van-tab title="视频" name="c">内容还在制作~~</van-tab>
      </van-tabs>


    </div>
  </div>
</template>
  
<script setup>
// 歌单页面
import { artistDetail, artistDesc, artistSongs } from '@/utils/api/home';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { play } from '@/utils/method/common'

const artistInfo = ref()
const cover = ref('')
const name1 = ref('')
const name2 = ref('')
const fans = ref('')
const shenfen = ref('')
const activeName = ref('a')

let songs = ref([])

const route = useRoute()

onMounted(async () => {
  const id = route.params.id
  // 歌手详情
  const artistDetailData = await artistDetail({ id })
  artistInfo.value = artistDetailData.data.data
  cover.value = artistDetailData.data.data.artist.cover
  name1.value = artistDetailData.data.data.artist.name
  name2.value = artistDetailData.data.data.artist.alias[0]
  shenfen.value = artistDetailData.data.data.identify.imageDesc
  console.log(artistInfo, 'artistInfo');

  // 歌手描述
  const artistDescData = await artistDesc({ id })
  console.log(artistDescData, 'gdhdgv');

  // 歌手全部歌曲
  const artistSongsData = await artistSongs({ id })
  songs.value = artistSongsData.data.songs
  console.log(artistSongsData, 'songs');

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

    img {
      width: 100vw;
    }
  }

  .content {
    padding-top: 5vw;
    width: 100%;
    min-height: 110vw;
    background-color: #fff;
    transform: translateY(-10vw);

    .info {
      margin: 0 auto;
      border-radius: 5vw 5vw 5vw 5vw;
      box-shadow: 0 0 1px 0px rgb(86, 90, 92);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 90%;
      background-color: rgba(255, 255, 255, 0.95);
      transform: translateY(-10vw);

      .name1 {
        margin-top: 5vw;
        font-size: 20px;
        font-weight: bolder;
      }

      .name2,
      .fans,
      .shenfen {
        margin-top: 3vw;
        font-size: 16px;
      }

      .shenfen {
        width: 90%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

    }

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