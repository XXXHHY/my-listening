<template>
  <div class="top">
    <van-card v-for="item in topListData" :key="item.id" :title="item.name" :thumb="item.coverImgUrl" @click-thumb="turn(item.id)">
      <template #tags>
        <div class="songs">
          <div class="song" v-for="(song, index) in item.tracks" :key="index">
            <span>{{ song.first }}----{{ song.second }}</span>
          </div>
        </div>
      </template>
    </van-card>
  </div>
</template>

<script setup>
import SongMenu from '@/components/SongMenu.vue';
import { onBeforeMount, ref } from 'vue';
import { topList } from '@/utils/api/home'
import { useRouter } from 'vue-router';

const topListData = ref([])

onBeforeMount(async () => {
  const data = await topList()
  console.log(data, '8888');

  topListData.value = data.data.list

})

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
.top {
  .songs {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    height: 100%;

    .song {
      span {
        width: 100%;
        height: 20%;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>