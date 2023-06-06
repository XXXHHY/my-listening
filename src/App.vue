<template>
  <TabbarTop></TabbarTop>
  <router-view/>
   <div class="audio">
    <MyAudio :url="url" :song="song"></MyAudio>
   </div>
  <TabbarBot v-show="showAudio"></TabbarBot>
</template>

<script setup>
import TabbarTop from '@/components/TabbarTop.vue'
import TabbarBot from '@/components/TabbarBot.vue'
import MyAudio from '@/components/utils/MyAudio.vue';
import { watch, ref, computed } from 'vue'
import { useStore } from 'vuex'

const url = ref('') // 歌曲的播放链接
const song = ref({ // 歌曲需要用到的一些
      name: '歌名',
      ar: [
        {name: '歌手'}
      ]
    })

const store = useStore()
const showAudio = computed(() => {
  return store.state.musicInfo.isShowAudio
})

// 监听歌曲播放链接，一改变就赋值
watch(() => store.state.musicInfo.currentUrl, (newVal, oldVal) => {
  if(newVal !== oldVal) {
    url.value = newVal
    song.value = store.state.musicInfo.currentSong
  }
},{
  immediate: true
})

</script>

<style lang="less">
* {
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: auto;
  position: relative;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}


.audio {
  width: 100%;
  position: fixed;
  bottom: 50px;
  left: 0;
}
</style>
