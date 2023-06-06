<template>
  <div class="container">
    <audio @canplay="getDuration" controls @timeupdate="updateTime" v-show="false" ref="audio"
           :src="audioSrc"/>
    <div class="card">
      <div class="progress" ref="progress" @click="clickProgress" @mouseup="handleMouseup">
        <div class="currentProgress" ref="currentProgress">
          <span class="circle" ref="circle" @mousedown="handleMousedown"></span>
        </div>
      </div>
      <div class="time">
        <span class="startTime">{{ currentDuration }}</span>
        <span class="endTime">{{ duration }}</span>
      </div>
      <div class="option">
        <span class="pre" @click="handleBack">
          <img src="" alt="快退"> <span
            style="color: #C7C7C9;font-size: 13px;margin-left: 10px">-{{ backSecond }}s</span>
        </span>
        <span class="play" @click="handlePauseOrPlay">
          <el-icon size="35px" color="#3853FE">
            <video-pause v-show="!paused"/>
            <video-play v-show="paused"/>
          </el-icon>
        </span>
        <span class="next" @click="handleForward">
          <span style="color: #C7C7C9;font-size: 13px;margin-right: 10px">+{{ forwardSecond }}s </span>
          <img src="" alt="快进">
        </span>
        <div class="volumePanel">
          <lk-select v-model:visible="volumeVisible">
            <template v-slot:reference>
              <img class="volume" v-if="volume > 0" src="" alt="图片1">
              <img class="volume" v-else src="" alt="图片2">
            </template>
            <div class="progressY" ref="progressY">
              <div class="currentProgressY" ref="currentProgressY">
                <span class="circleY" ref="circleY" @mousedown="handleVolumeMousedown"></span>
              </div>
            </div>
          </lk-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
import lkSelect from './lkSelect.vue'

export default {
  name: "index",
  components: { lkSelect },
  props: {
    audioSrc: {
      type: String,
      default: 'https://img-qn.51miz.com/Audio/2017/02/06/08/20170206081849_A100187_34f7e6b8-thumb.mp3'
    },
    backSecond: {
      type: Number,
      default: 3
    },
    forwardSecond: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      duration: '00:00',
      currentDuration: '00:00',
      audio: '',
      volume: 1,
      paused: true,
      isMoveIn: false, //是否在移动中
      showVolumePanel: false,
      volumeVisible: false
    }
  },
  methods: {
    //后退
    handleBack() {
      if (this.audio.currentTime > this.backSecond) {
        this.audio.currentTime = this.audio.currentTime - this.backSecond
      }
    },
    //前进
    handleForward() {
      if (this.audio.duration - this.audio.currentTime > this.forwardSecond) {
        this.audio.currentTime = this.audio.currentTime + 10
      }
    },
    //暂停或播放
    handlePauseOrPlay() {
      this.audio.paused ? this.audio.play() : this.audio.pause()
      this.paused = !this.paused
    },
    //视频在可以播放时触发
    getDuration() {
      this.duration = this.timeFormat(this.$refs.audio.duration)
      this.audio = this.$refs.audio
      this.audio.volume = this.volume //默认百分百音量
      //监听音量的变化
      // this.audio.addEventListener('volumechange',(value)=>{
      //   console.log(this.audio.volume)
      // })
    },
    //将单位为秒的的时间转换成mm:ss的形式
    timeFormat( number ) {
      let minute = parseInt(number / 60);
      let second = parseInt(number % 60);
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;
      return minute + ":" + second;
    },
    //进度条发生变化时触发
    updateTime() {
      if (!this.$refs.progress) return
      this.currentDuration = this.timeFormat(this.audio.currentTime)
      //如果不是正在移动 和 没有暂停播放就执行
      if (!this.isMoveIn || !this.audio.paused) {
        // 设置当前时间
        let MoveX = this.$refs.progress.clientWidth * ( this.audio.currentTime / this.audio.duration )
        //播放时更新距离
        this.$refs.currentProgress.style.width = MoveX + 'px'
        this.$refs.circle.style.left = MoveX - ( this.$refs.circle.clientWidth / 2 ) + 'px'
      }
    },
    //点击进度条更新进度
    clickProgress( e ) {
      //如果不是正在移动 和 没有暂停播放就执行
      if (!this.isMoveIn || !this.audio.paused) {
        this.updateProgress(e.offsetX)
      }
    },
    //更新进度
    updateProgress( MoveX ) {
      //当前移动的位置 = 当前移动的位置 / 当前进度条的可视长度    //this.$refs.progress.clientWidth 注意一定要拿总长度 否则会拿进度条已经走过的长度
      let clickProgress = ( MoveX / this.$refs.progress.clientWidth )
      //设置播放的时间 = 总时长 * 当前点击的长度
      this.audio.currentTime = this.audio.duration * clickProgress
      //设置移动的位置
      this.$refs.currentProgress.style.width = MoveX + 'px'
      this.$refs.circle.style.left = MoveX - ( this.$refs.circle.clientWidth / 2 ) + 'px'
    },
    //更新音量进度
    updateVolumeProgress(MoveY){
      //得到音量  【0 - 1】 区间
      const volume = ((this.$refs.currentProgressY.clientHeight / 60) * 100 / 100).toFixed(1)
      this.audio.volume = volume
      this.volume = volume
      //移动音量条
      this.$refs.currentProgressY.style.height = MoveY + 'px'
      //移动小圆圈
      this.$refs.circleY.style.Top = MoveY - ( this.$refs.circleY.clientHeight / 2 ) + 'px'
    },
    //鼠标弹起
    handleMouseup() {
      setTimeout(() => {
        this.audio.play()
        this.paused = false
        this.isMoveIn = false
      }, 200)
    },
    //调整进度
    handleMousedown() {
      this.audio.pause()
      this.paused = true
      this.isMoveIn = true
      let progress = this.$refs.progress
      //进度条 左 边距离页面左边的距离 移动最小值
      let moveMin = progress.offsetParent.offsetLeft + progress.offsetLeft
      //进度条 右 边距离页面左边的距离 移动最大值
      let moveMax = progress.offsetParent.offsetLeft + progress.offsetLeft + progress.clientWidth
      //小圆圈的宽度
      let circleWidth = ( this.$refs.circle.clientWidth / 2 )
      let moveX = ( e ) => {
        if (e.pageX >= moveMax) {
          return
        } else if (e.pageX <= moveMin) {
          return
        }
        this.$refs.circle.style.left = e.pageX - moveMin - circleWidth + 'px'
        this.updateProgress(e.pageX - moveMin)
      }
      //获取当前鼠标的位置 X
      document.addEventListener('mousemove', moveX)
      //鼠标弹起来
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveX)
      })
    },
    //调整音量
    handleVolumeMousedown(){
      let progressY = this.$refs.progressY
      //音量的最小值
      let moveMin = progressY.offsetParent.offsetTop
      //音量的最大值
      let moveMax = progressY.offsetParent.offsetTop + progressY.clientHeight
      //小圆圈的高度
      let circleHeight = ( this.$refs.circleY.clientHeight / 2 )
      let moveY = ( e ) => {
        //禁止移动时复制内容
        e.preventDefault()
        if (e.pageY >= moveMax) {
          return
        } else if (e.pageY <= moveMin) {
          return
        }
        this.$refs.circleY.style.top = e.pageY - moveMin - circleHeight + 'px'
        this.updateVolumeProgress(e.pageY - moveMin)
      }
      //获取当前鼠标的位置 X
      document.addEventListener('mousemove', moveY)
      //鼠标弹起来
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveY)
      })
    }
  }
}
</script>

<style scoped lang="less">
.card {
  width: 300px;
  padding: 30px;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.03);
  border-radius: 10px;

  .volumePanel {
    .volume {
      width: 20px;
      padding-top: 5px;
    }

    .volumeOption {
      cursor: pointer;
    }
  }

  .progress, .progressY {
    height: 7px;
    border-radius: 3px;
    margin-bottom: 5px;
    width: 100%;
    background-color: #DADFEA;
    cursor: pointer;

    .currentProgress, .currentProgressY {
      position: relative;
      height: 100%;
      width: 0;
      background-color: #3853FE;
      border-radius: 3px;

      .circle, .circleY {
        position: absolute;
        right: -6px;
        top: -2px;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #3853FE;
        background-color: #fff;

        &:hover {
          width: 12px;
          height: 12px;
          top: -3px;
          border-radius: 50%;
        }
      }
    }
  }

  .progressY {
    width: 7px;
    height: 60px;
    margin: 10px;
    .currentProgressY{
      height: 100%;
      width: 100%;
      .circleY {
        bottom:-2px;
        right: -3px;
        top: unset;
        &:hover {
          width: 12px;
          height: 12px;
          bottom: -2px;
          top: unset;
          border-radius: 50%;
        }
      }
    }
  }

  .time {
    display: flex;
    justify-content: space-between;
    color: #777A85;
    font-size: 12px;
  }

  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px 0 30px;

    .play, .pre, .next {
      display: flex;
      padding: 0 2px;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>

