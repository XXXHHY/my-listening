import instance from "../request";

/**
 * 关键词搜索歌曲（接口地址cloudsearch更全）
 * @params {String} keywords 歌曲关键词
 * @params {Number} [limit] 返回歌曲的数量
 * @params {Number} [offset] 偏移量
 * @params {Number} [type] 搜索类型，默认为1（单曲）其他：10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
 */
export const search = (keywords) => {
  return instance({
    url: 'search',
    method: 'get',
    params: {
      keywords: keywords
    }
  })
}

/**
 * 搜索建议
 * @params {String} keywords 搜索关键词 
 * @params {String} [type] 如果为mobile则返回移动端数据
 */
export const searchSuggest = (params) => {
  return instance({
    url: 'search/suggest',
    method: 'get',
    params: {...params}
  })
}

/**
 * 热搜列表(search/hot/detail为详细结果)
 */
export const searchHotList = () => {
  return instance({
    url: 'search/hot/detail',
    method: 'get'
  })
}





/**
 * 歌单所有歌曲
 * @params {Number} id 歌单的id 
 * @params {Number} [limit] 限制歌曲的数量，默认为当前歌单所有数量
 * @params {Number} [offset] 偏移量，从该数量开始选取所需的数量，默认为0
 */
export const getAllSongs = (params) => {
  return instance({
    url: 'playlist/track/all',
    method: 'get',
    params: {...params}
  })
}

/**
 * 歌单所有歌曲
 * @params {Number} id 歌单的id 
 * @params {Number} [s] 歌单最近的s个收藏者
 */
export const getMenuDetail = (params) => {
  return instance({
    url: 'playlist/detail',
    method: 'get',
    params: {...params}
  })
}


/**
 * 根据歌曲id获取音乐url
 * @params {Number} id 歌曲的id 
 * @params {String} level 播放音质等级, 分为 standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res, jyeffect => 鲸云臻音, jymaster => 鲸云母带
 */
export const getSong = (params) => {
  return instance({
    url: 'song/url/v1',
    method: 'get',
    params: {...params}
  })
}
