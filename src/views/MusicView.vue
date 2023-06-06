<template>
  <div class="bgi" :style="{ backgroundImage: 'url(' + cover + ')' }"></div>
  <div class="music" ref="currentDom">
    <div class="name">
      <span class="n1">{{ name1 }}</span>
      <span>{{ name2 }}</span>
    </div>

    <div class="bgc" v-show="!isShowLyric" @click="changeLyric">
      <div class="tupian">
        <div :class="{ little: true, XuanZhuan: isPlaying ? true : false }">
          <img :src="cover" alt="">
        </div>
      </div>
    </div>

    <div class="lyric" v-show="isShowLyric" @click="changeLyric">
      <div class="words" :style="{ top: top }">
        <div class="word" :class="{active: index == wordIndex}" v-for="(item, index) in lyricArr" :key="index">{{ item.lyric }}</div>
      </div>
    </div>

    <div class="option">
      <div class="first">
        <div class="jdt" @click="changePosition" ref="jdt">
          <div class="currentJdt" ref="currentJdt">
            <span class="circle" ref="circle"></span>
          </div>
        </div>
        <div class="time">
          <span>{{ currentTime }}</span>
          <span>{{ totalTime }}</span>
        </div>
      </div>
      <div class="second">
        <div class="bofangWays" @click="changeWays">
          <i class="iconfont icon-24gl-shuffle" v-show="bofangWays === 3"></i>
          <i class="iconfont icon-24gl-repeatDot2" v-show="bofangWays === 1"></i>
          <i class="iconfont icon-24gl-repeatOnce2" v-show="bofangWays === 2"></i>
        </div>
        <i class="iconfont icon-shangyishoushangyige" @click="preSong"></i>
        <div class="play" @click="changeStatus">
          <van-icon name="play-circle-o" v-show="!isPlaying" size="55" color="white" />
          <van-icon name="pause-circle-o" v-show="isPlaying" size="55" color="white" />
        </div>
        <i class="iconfont icon-xiayigexiayishou" @click="nextSong"></i>
        <van-icon name="ellipsis" size="30" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { timeFormat, next, pre, lyricFormat, timeBack } from '@/utils/method/common';
import { lyric } from '@/utils/api/home'

const store = useStore()
console.log(store, 'store');
const cover = computed(() => store.state.musicInfo.currentSong.al.picUrl)//背景图
const isPlaying = computed(() => store.state.musicInfo.currentMusic.isPlaying)//是否在播放
const name1 = computed(() => store.state.musicInfo.currentSong.name)
const name2 = computed(() => store.state.musicInfo.currentSong.ar[0].name)
console.log(name1, name2, 'name');
const totalTime = computed(() => {
  return timeFormat(store.state.musicInfo.currentMusic.totalTime)
})
const jdt = ref() // jdt的dom
const currentDom = ref() // 当前组件的dom
const currentJdt = ref() // 移动进度条的dom
const circle = ref() // 进度条上圆的dom
const currentTime = ref('00:00')
const bofangWays = ref(1) // 播放方式：1顺序播放 2单曲循环 3随机播放
const lyricArr = ref([{ time: '00:00:00', lyric: '暂无歌词' }])
const isShowLyric = ref(false)
const top = ref('200px')
const wordIndex = ref(0)

watch(() => store.state.musicInfo.currentMusic.currentTime, (n, o) => {
  if (n !== o) {
    currentTime.value = timeFormat(n)
    // 总时长
    const totalTime = store.state.musicInfo.currentMusic.totalTime

    // 改变进度条进度
    currentJdt.value.style.width = (n / totalTime) * jdt.value.clientWidth + 'px' // 进度条
    circle.value.style.left = currentJdt.value.style.width - (circle.clientWidth / 2) + 'px'


    // 歌词滚动
    lyricArr.value.forEach((item, index) => {
      // 37.25px
      
      if (item.time == n.toFixed(0)) {
        top.value = 200 - 35.25 * index + 'px'
        console.log(item.time, 'time');
        wordIndex.value = index
      }
    })
  }
})
console.log(isPlaying, 'isP');
// 点击改变进度条位置
const changePosition = (e) => {
  // 如果音乐没有在播放，不继续向下执行
  if (!isPlaying.value) return
  // console.log(e, 'eee');
  const clickWidth = e.offsetX // 点前点击位置的宽度
  const totalWidth = jdt.value.clientWidth // 进度条总长度
  // 真实的audio元素
  const audio = currentDom.value.parentElement.childNodes[6].childNodes[1]
  const currentTime = clickWidth / totalWidth // 点击位置占播放时长的百分比

  audio.currentTime = currentTime * audio.duration // 设置audio的播放时长

  // 改变进度条进度
  currentJdt.value.style.width = e.offsetX + 'px' // 进度条
  circle.value.style.left = e.offsetX - (circle.clientWidth / 2) + 'px'
}

// 改变播放暂停的状态
const changeStatus = () => {
  const audio = currentDom.value.parentElement.childNodes[6].childNodes[1]
  // 暂停/开始播放
  if (isPlaying.value == true) {
    audio.pause()
    store.commit('changePlaying', false)
  } else {
    audio.play()
    store.commit('changePlaying', true)
  }
}

// 下一首
const nextSong = () => {
  const id = store.state.musicInfo.currentSong.id
  next(id)
}

// 上一首
const preSong = () => {
  const id = store.state.musicInfo.currentSong.id
  pre(id)
}

// 修改播放方式
// 当前为顺序播放，切换为单曲循环
const changeWays = () => {
  switch (bofangWays.value) {
    case 1:
      bofangWays.value = 2
      store.commit('changeBofangWays', 2)
      break;
    case 2:
      bofangWays.value = 3
      store.commit('changeBofangWays', 3)
      break;
    case 3:
      bofangWays.value = 1
      store.commit('changeBofangWays', 1)
      break;
  }
}

// 请求歌词数据
onMounted(async () => {
  const id = store.state.musicInfo.currentSong.id || ''
  if (id) {
    const data = await lyric({ id })
    const result = lyricFormat(data.data.lrc.lyric)
    console.log(result, 'result');
    lyricArr.value = result
  }
})

// 改变是否展示歌词
const changeLyric = () => isShowLyric.value = !isShowLyric.value
</script>

<style lang='less' scoped>
.bgi {
  float: left;
  width: 100vw;
  height: 621px;
  background-color: rgb(104, 89, 89);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: blur(15px) brightness(50%);
}


.music {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 621px;
  color: #fff;
  z-index: 666;

  .name {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;

    .n1 {
      margin-bottom: 3%;
      font-size: 20px;
    }

  }

  .bgc {
    .tupian {
      margin: 5% auto;
      padding: 12vw;
      border-radius: 50%;
      width: 80vw;
      height: 80vw;
      background-color: black;
      box-shadow: 0 0 3px 3px rgb(179, 156, 156);


      .little {
        border-radius: 50%;
        width: 56vw;
        height: 56vw;
        background-color: pink;
        overflow: hidden;

        img {
          widows: 56vw;
          height: 56vw;
        }
      }
    }
  }

  .lyric {
    margin-top: 3vw;
    width: 100vw;
    height: 60vh;
    overflow: hidden;
    position: relative;

    .words {
      position: relative;
      // top: 200px;

      .word {
        margin: 3vw auto;
        // height: 3vh;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: #a0a1a8;
        transition: 1s;
      }

      .active {
        font-size: 18px;
        color: #fff;
      }
    }
  }

  .option {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 555;

    .first {

      .jdt {
        height: 7px;
        border-radius: 3px;
        margin: 5vw auto;
        width: 80vw;
        background-color: #DADFEA;
        cursor: pointer;

        .currentJdt {
          position: relative;
          height: 100%;
          width: 0;
          background-color: #3853FE;
          border-radius: 3px;

          .circle {
            position: absolute;
            right: -6px;
            top: -2px;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #3853FE;
            background-color: #fff;
          }
        }
      }

      .time {
        margin: 2vw auto;
        width: 80vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .second {
      margin-bottom: 2vw;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100vw;
    }
  }
}

.XuanZhuan {
  animation: XZ 5s linear infinite;
}

@keyframes XZ {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.iconfont {
  font-size: 30px;
}
</style>