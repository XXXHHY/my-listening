import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    home: {
      banners: [],
      miniMenu: {
        songMenu: {},
        singer: {},
        more: {}
      },
      homeRecommend: [],
      hasData: false,

    },
    musicInfo: {
      isShowAudio: true,
      currentUrl: '',
      currentSong: {
        name: '歌名',
        ar: [{
          name: '歌手'
        }],
        al: {
          picUrl: ''
        }
      },
      musicList: [],
      currentMusic: {
        totalTime: 0,
        currentTime: 0,
        isPlaying: false,
        isLoop: false,
        bofangWays: 1
      }
    },
    searchInfo: {
      time: null,
      hotList: [],
      searchHistory: new Set()
    }
  },
  getters: {
    getRecommend(state) {
      return state.home.homeRecommend
    }
  },
  mutations: {
    // 存储首页相关信息
    setHomeData(state, homeData) {
      state.home.banners = homeData.banners
      state.home.homeRecommend = homeData.homeRecommend
      state.home.hasData = true
    },

    // audio存储的音乐信息
    setMusicInfo(state, info) {
      state.musicInfo.currentUrl = info.url
      state.musicInfo.currentSong = info.song
      if (info.song.repeat) {
        return
      } else {
        state.musicInfo.musicList.push(info.song)

      }
    },

    setBofangInfo(state, time) { // 音乐播放时的信息
      state.musicInfo.currentMusic.currentTime = time.current
      state.musicInfo.currentMusic.totalTime = time.total
    },


    // 当前音乐是否正在播放
    changePlaying(state, YoN) {
      state.musicInfo.currentMusic.isPlaying = YoN
    },

    // 当前音乐是否循环播放
    changeLoop(state, YoN) {
      state.musicInfo.currentMusic.isLoop = YoN
    },

    changeBofangWays(state, bofangWays) {
      state.musicInfo.currentMusic.bofangWays = bofangWays
    },

    // search相关的
    // 搜索中的热搜列表
    setHotList(state, hotInfo) {
      state.searchInfo.hotList = hotInfo.hotList
      state.searchInfo.time = hotInfo.time
    },

    // 搜索历史存储
    setSearchHistory(state, searchHistory) {
      state.searchInfo.searchHistory.delete(searchHistory)
      state.searchInfo.searchHistory.add(searchHistory)
    },

    // 清空搜索历史
    removeSearchHistory(state) {
      state.searchInfo.searchHistory = []
    }
  },
  actions: {},
  modules: {}
})