<template>
  <!-- 搜索框 -->
  <form action="/">
    <van-search shape="round" v-model="keywords" show-action placeholder="请输入搜索关键词" action-text="取消" @search="onSearch"
      @cancel="cancel" @update:model-value="change" @focus="focus"/>
  </form>

  <div class="searchContent" v-if="isShowSearch">
    <!-- 顶部导航 -->
    <div class="top">
      <span>单曲</span>
      <span>专辑</span>
      <span>视频</span>
      <span>。。。</span>
    </div>
    <div class="content">
      <div class="song" v-for="(item, index) in searchList" :key="index" @click="bofang(item.id)">
        <span>{{ index + 1 }}</span>
        <div class="detail" @click="play(item)">
          <span class="name">{{ item.name }}</span>
          <span class="des">{{ item.artists[0].name }}—{{ item.alias[0] }}</span>
        </div>
        <span><van-icon name="ellipsis" /></span>
      </div>
    </div>
  </div>

  <div class="show" v-else>
    <!-- 搜索提示内容 -->
    <div class="tips" v-if="isShow">
      <li v-for="(item, index) in tipsList" :key="index" @click="tipSearch(item.keyword)"> {{ item.keyword }} </li>
    </div>

    <!-- 热搜内容 -->
    <div class="hot" v-else>
      <div class="history">
        <div class="top">
          <span>搜索历史</span>
          <van-icon name="delete-o" size="25" />
        </div>
        <div class="content">
          <span v-for="item in searchHistory" :key="item">{{ item }}</span>
          
        </div>
      </div>

      <div class="hotList">
        <div class="title">热搜榜</div>
        <div class="list">
          <li v-for="(item, index) in hotList" :key="index">{{ index + 1 }} {{ item.searchWord }} <van-tag
              v-if="item.iconType == 1" type="danger" size="12px">热</van-tag></li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex'
import { search, searchSuggest, searchHotList } from '@/utils/api/search';
import { play } from '@/utils/method/common'

const store = useStore()
const keywords = ref('') //搜索框绑定的关键词
const hotList = ref([]) // 热门搜索列表
const isShow = ref(false) // 是否展示搜索内容
const searchList = ref([]) // 搜索列表
const tipsList = ref([]) // 搜索提示列表
const isShowSearch = ref(false) // 是否展示搜索的内容
const searchHistory = computed(() => {
  const mySet = store.state.searchInfo.searchHistory
  const array = [...mySet].reverse()
  return array
})

onMounted(async () => {
  // 获取当前时间戳
  const timeStamp = new Date().getTime()

  if (!store.state.searchInfo.time || timeStamp - store.state.searchInfo.time > 600000) { // 时间戳为空，则没有存入数据,或者有时间戳超时了
    // 热搜数据
    const hotListData = await searchHotList()
    console.log(hotListData, 'hotListData');

    hotList.value = hotListData.data.data
    store.commit('setHotList', {
      hotList: hotList.value,
      time: timeStamp
    })
  }else{ // 有时间戳且没有超时
    hotList.value = store.state.searchInfo.hotList
    console.log('走缓存');
  }
})

// 输入框获得焦点时触发
const focus = () => {
  isShowSearch.value = false
}

// 搜索时调用
const onSearch = async (val) => {
  console.log(val, 222);
  // 搜索返回的数据
  const searchData = await search({
    keywords: val
  })

  // 搜索内容列表
  searchList.value = searchData.data.result.songs

  // 更改显示状态
  isShowSearch.value = true

  // 存储搜索历史内容
  store.commit('setSearchHistory', val)  
}

// 通过搜索提示点击的搜索
const tipSearch = (keyword) => {
  onSearch(keyword)
}

// 取消搜索时调用
const cancel = () => {
  // 清空搜索框内容
  keywords.value = ''

  // 改变isShow
  isShow.value = false
}

// 输入框内容变化时调用
const change = async () => {
  // 根据搜索框内容调节isShow的值
  if (!keywords.value) {
    isShow.value = false
  } else {
    isShow.value = true
  }

  // 根据keywords请求搜索提示列表
  const tipsData = await searchSuggest({
    keywords: keywords.value,
    type: 'mobile'
  })

  tipsList.value = tipsData.data.result.allMatch || []
  console.log(tipsData, 111);

}

const bofang = () => {

}
</script>

<style lang='less' scoped>
.show {
  width: 100%;
  height: 67vh;
  overflow: auto;

  // height: 40vw;
  .tips {
    li {
      padding: 5%;
      list-style: none;
      width: 100%;
      text-align: left;
    }

  }


  .hot {
    .history {
      .top {
        width: 100%;
        padding: 5%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .content {
        padding: 5%;

        span {
          float: left;
          margin-right: 5%;
          border-radius: 6px;
          font-size: 12px;
          height: 16px;
          line-height: 16px;
          background-color: pink;
        }
      }
    }

    .hotList {
      padding: 5%;
      width: 100%;

      .title {
        padding-bottom: 5%;
        border-bottom: 1px solid rgb(153, 126, 126);
        width: 100%;
        font-size: 20px;
      }

      .list {
        li {
          list-style: none;
          font-size: 16px;
          margin: 5%;
        }
      }
    }
  }
}

.searchContent {
  .content {
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