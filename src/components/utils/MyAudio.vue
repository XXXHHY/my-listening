<template>
  <audio ref="audio" autoplay controls :loop="isLoop" :src="url" style="display: none" @canplay="bofang" @timeupdate="timeupdate" @ended="ended"></audio>

  <div class="my-audio" v-show="showAudio">
    <div class="img">
      <img :src="song.al.picUrl" alt="">
    </div>
    <span class="info">
      {{ song.name }} - {{ song.ar[0].name }}
    </span>
    <span class="start-stop" @click="changeStatus">
      <van-circle class="huan" :stroke-width="80" v-model:current-rate="currentRate" :rate="rate" speed="100" size="25">
        <van-icon name="pause-circle-o" v-show="isPlay" size="25"/>
        <van-icon name="play-circle-o" v-show="!isPlay" size="25"/>
      </van-circle>
    </span>
    <span class="songs-list">
      <van-icon name="ellipsis" size="25" />
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { play, next } from '@/utils/method/common'
// import { timeFormat } from '@/utils/method/common'

// 定义audio会用到的变量
const isPlay = ref(false) // 是否正在播放
const currentDuration = ref(0) // 播放时间进度条
const duration = ref(0) // 音频的总时长，单位为s
const audio = ref(null) // audio标签的dom
const store = useStore()
// const bofangWays = computed(() => store.state.musicInfo.currentMusic.bofangWays) // 播放方式 1顺序播放 2单曲循环 3随机播放
const isLoop = ref(false) // 是否重复播放
const showAudio = computed(() => {
  return store.state.musicInfo.isShowAudio
})

// 环形进度条需要的
const currentRate = ref(0)
const rate = computed(() => {
  return currentDuration.value / duration.value * 100
})

const props = defineProps({
  url: {
    default: '',
    type: String
  },
  song: {
    default: {
      name: '歌名',
      ar: [
        {name: '歌手'}
      ]
    },
    type: Object
  }
})

watch(() => store.state.musicInfo.currentUrl, (n, o) => {
  if(n !== o) {
    // 歌曲改变立马调用播放功能
    audio.value.play()
    // 切换播放状态
    isPlay.value = true
    store.commit('changePlaying', true)
  }
})

watch(() => store.state.musicInfo.currentMusic.isLoop, (n, o) => {
  if(n != o) {
    isLoop.value = n
  }

})

// 定义改变是否播放的方法（isPlay）
const changeStatus = () => {
  // 暂停/开始播放
  if(isPlay.value == true) {
    audio.value.pause()    
    store.commit('changePlaying', false)
  }else {
    audio.value.play()
    store.commit('changePlaying', true)
  }
  isPlay.value = !isPlay.value
}

// audio播放的瞬间会触发这个方法
const bofang = () => {
  // 总时长
  duration.value = audio.value.duration;
}


// 音频播放时调用的，时间改变就会调用 
const timeupdate = () => {
  // 当前播放到的时间（单位秒）
  currentDuration.value = audio.value.currentTime
  // console.log(rate, '11111');
  store.commit('setBofangInfo', {
    current: currentDuration.value,
    total: duration.value
  })
}

// 当前歌曲播放结束后触发
const ended = () => {
  next(props.song.id)
}

console.log(audio, 'audioinfo');
</script>

<style lang='less' scoped>
.my-audio {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 18vw;
  background-color: pink;
  // position: absolute;
  // left: 0;
  // bottom: 50px;



  .img {

    img {
      border-radius: 50%;
      width: 14vw;
      height: 14vw;
      background-color: skyblue;
    }
  }

  .info {
    width: 56vw;
  }

  .start-stop {
    .huan {
      line-height: 27px;
      align-items: center;
    }
  }

  .songs-list {}
}
</style>