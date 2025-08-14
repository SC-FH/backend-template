import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia"
import router from './router'
import ElementPlus from "element-plus"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "sanitize.css"
import "@csstools/normalize.css"
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' //element-plus dark 样式
import "./assets/iconfont/iconfont.css"
import "./assets/css/font.css"  //字体
import "./assets/css/theme.scss" //主题样式

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

//引入element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia()).use(router).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')


