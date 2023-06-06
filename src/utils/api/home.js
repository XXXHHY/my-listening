import instance from "../request";

/**
 * 首页发现（轮播图, 推荐歌单）
 * 
 */

export const homepage = () => {
  return instance({
    url: 'homepage/block/page',
    method: 'get',
    params: {

    }
  })
}

/**
 * 首页排行榜
 * 
 */
export const topList = () => {
  return instance({
    url: 'toplist/detail',
    method: 'get'
  })
}


/**
 * 首页精品歌单
 * 
 */
export const highquality = (limit = 20,) => {
  return instance({
    url: '/playlist/highquality/tags',
    method: 'get'
  })
}

/**
 * 首页歌手分类
 * @params {Number} [limit] 返回歌手数量，默认为30
 * @params {Number} [offset] 偏移量，默认为0
 * @params {Number} [type] 分类一： -1（全部） 1（男歌手） 2（女歌手） 3（乐队）
 * @params {Number} [area] 分类二： -1（全部） 7（华语） 96（欧美） 8（日本） 16（韩国） 0（其他）
 */
export const artists = (params) => {
  return instance({
    url: 'artist/list',
    method: 'get',
    params
  })
}

/**
 * 歌手详情desc
 * @params {Number} id 歌手的id
 */
export const artistDetail = (params) => {
  return instance({
    url: 'artist/detail',
    method:'get',
    params
  })
}

/**
 * 歌手描述desc
 * @params {Number} id 歌手的id
 */
 export const artistDesc = (params) => {
  return instance({
    url: 'artist/desc',
    method:'get',
    params
  })
}


/**
 * 歌手全部歌曲
 * @params {Number} id 歌手的id
 * @params {String} [order] hot ,time 按照热门或者时间排序
 * @params {Number} [limit] 取出歌单数量 , 默认为 50
 * @params {Number} [offset] 偏移数量,用于分页,如:(评论页数-1)*50,其中50为limit 的值
 */
export const artistSongs = (params) => {
  return instance({
    url: 'artist/songs',
    method: 'get',
    params
  })
}

/**
 * 歌曲歌词
 * @params {Number} id 歌曲的id
 */
export const lyric = (params) => {
  return instance({
    url: 'lyric',
    method: 'get',
    params
  })
}