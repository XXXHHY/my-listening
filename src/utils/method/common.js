import store from "@/store"

import {
  getSong
} from "../api/search"

// 播放音乐时都会用到的方法
// id是选中歌曲的id
export const play = async (song) => {
  const params = {
    id: song.id,
    // 音质暂时都为极高
    level: 'exhigh'
  }
  // 得到返回的数据
  const data = await getSong(params)

  // currentSong: {
  //   name: '歌名',
  //   ar: [
  //     {name: '歌手'}
  //   ],
  //   al: {
  //     picUrl: ''
  //   }
  // }
  console.log(song, 'songs');
  const realData = {
    ...song,
    ar: song.ar || song.artists,
    al: song.al || {
      ...song.album,
      picUrl: song.album.artist.img1v1Url
    }
  }

  console.log(realData, 'realDatas');
  // 将需要发给store存储的数据格式整理好
  const info = {
    url: data.data.data[0].url,
    song: realData
  }

  console.log(data, 'songUrl')

  // 如果没有会员或没有版权则返回的url为空
  if (!data.data.data[0].url) return console.log('该歌曲无法播放');

  store.commit('setMusicInfo', info)
}


// 这是一个生成m到n的随机整数的函数(n > m)
const ranNum = (m, n) => {
  return parseInt(Math.random() * Math.abs(n - m) + m)
}

export const next = (id) => {
  // isLoop.value = false
  store.commit('changeLoop', false)
  let list = store.state.musicInfo.musicList
  let num = list.length
  const bofangWays = store.state.musicInfo.currentMusic.bofangWays
  const index = list.findIndex(item => item.id == id)
  if (num === 1) { // 播放列表只有一首
    // 直接单曲循环
    // isLoop.value = true
    store.commit('changeLoop', true)
  } else if (bofangWays === 1) { // 顺序播放
    // console.log(list[1].id, props.song.id, '2222222');
    console.log({
      ...list[index + 1]
    }, 'indx0');
    if (index + 1 < num) { // 还没有播放到最后一首
      play({
        ...list[index + 1],
        repeat: true
      })
      console.log('zou1');
    } else { // 已经播放到最后一首了
      play({
        ...list[0],
        repeat: true
      })
      console.log('zou2');

    }
  } else if (bofangWays === 2) { // 当前是单曲循环
    store.commit('changeLoop', true)
  } else if (bofangWays === 3) { // 当前是随机播放
    const randomN = ranNum(0, num) // 生成0到num的随机整数
    console.log(randomN, {
      ...list[randomN],
      repeat: true
    }, 'next');
    play({
      ...list[randomN],
      repeat: true
    })
  }
}

export const pre = (id) => {
  // isLoop.value = false
  store.commit('changeLoop', false)
  let list = store.state.musicInfo.musicList
  let num = list.length
  const bofangWays = store.state.musicInfo.currentMusic.bofangWays
  const index = list.findIndex(item => item.id == id)
  if (num === 1) { // 播放列表只有一首
    // 直接单曲循环
    // isLoop.value = true
    store.commit('changeLoop', true)
  } else if (bofangWays === 1) { // 顺序播放
    console.log({
      ...list[index + 1]
    }, 'indx0');
    if (index > 0) { // 当前不是第一首
      play({
        ...list[index - 1],
        repeat: true
      })
      console.log('zou1');
    } else { // 已经播放到第一首了
      play({
        ...list[num - 1],
        repeat: true
      })
      console.log('zou2');
    }
  } else if (bofangWays === 2) { // 当前是单曲循环
    store.commit('changeLoop', true)
  } else if (bofangWays === 3) { // 当前是随机播放
    const random = ranNum(0, num) // 生成0到num的随机整数
    play({
      ...list[random],
      repeat: true
    })
  }
}
/**
 * 问题一
 * 随机播放下一首时，随机index可能与当前歌曲index相同，导致不会触发改变音乐
 * 需要优化
 * 
 * 问题二
 * 不管是任何播放形式（除了单曲循环），上一首应当是播放歌曲的上一首，而不是当前播放歌曲index的上一首index - 1，需要优化
 * 优化一：在每一首歌曲切换时保留当前歌曲信息并储存在下一首播放歌曲的对象中，每当点击上一首歌曲时播放当前歌曲对象的last储存的歌曲
 * 优化二：每当切换歌曲时，改变歌曲数组的顺序，找到当前歌曲在数组中的位置，删除之后，push将其添加到数组最后
 */


// 将音频总长度（以秒为单位）转换为 XX:XX 格式
export const timeFormat = (time) => {
  let minute = parseInt(time / 60)
  let second = parseInt(time % 60)

  if (minute < 10) {
    minute = '0' + minute
  }

  if (second < 10) {
    second = '0' + second
  }

  return `${minute}:${second}`
}

export const timeBack = (date) => {
  const arr = date.split(':')
  let time = 0
  if(arr[0][0] == 0) {
    time = +arr[0][1] * 60 + +arr[1]
  }else {
    time = +arr[0] * 60 + +arr[1]
  }

  return time
}

// 处理请求的歌词数据，返回数组对象，包括时间和歌词
export const lyricFormat = (lrc) => {
  let lrcArr = []
  const midArr = lrc.split('\n')
  console.log(midArr, 'midrr');
  midArr.forEach(item => {
    const rol = item.split(']')
    const rolObj = {
      time: timeBack(rol[0].slice(1)).toFixed(0),
      lyric: rol[1] || ''
    }
    lrcArr.push(rolObj)
  })

  lrcArr = lrcArr.filter(item => item.lyric != '')

  return lrcArr
}