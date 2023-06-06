import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant样式
import 'vant/lib/index.css'

// 全局注册需要的组件
import { Tabbar, TabbarItem, NavBar, Icon, Swipe, SwipeItem, Grid, GridItem, Card, Circle, Search, Tag, Collapse, CollapseItem, Tab, Tabs } from 'vant';

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Icon)
app.use(Swipe)
app.use(SwipeItem)
app.use(Grid)
app.use(GridItem)
app.use(Card)
app.use(Circle)
app.use(Search)
app.use(Tag)
app.use(Collapse)
app.use(CollapseItem)
app.use(Tab)
app.use(Tabs)

app.mount('#app')
