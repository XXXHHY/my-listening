import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '搜索'
    },
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/music',
    name: 'music',
    meta: {
      title: '音乐'
    },
    component: () => import('../views/MusicView.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '设置',
      keepAlive: true
    },
    component: () => import('../views/SettingView.vue')
  },
  {
    path: '/songmenu',
    name: 'songmemu',
    meta: {
      title: '排行榜'
    },
    component: () => import('../views/SongMenuView.vue')
  },
  {
    path: '/menu/:id',
    name: 'menu',
    meta: {
      title: '歌单',
    },
    component: () => import('../views/SongsView.vue')
  },
  {
    path: '/artist',
    name: 'artist',
    meta: {
      title: '歌手',
    },
    component: () => import('../views/ArtistsView.vue')
  },
  {
    path: '/artist_detail/:id',
    name: 'artist_detail',
    meta: {
      title: '歌手详情',
    },
    component: () => import('../views/ArtistDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// 后置守卫， 更改数据操作
router.afterEach((to, from) => {
  console.log(to, 'to');
  if(to.name != 'music') {
    store.state.musicInfo.isShowAudio = true
  }else {
    store.state.musicInfo.isShowAudio = false
  }
})




export default router
