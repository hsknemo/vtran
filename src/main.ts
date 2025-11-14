import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css';

import App from './App.vue'
import router from './router'
import { addCopyCode, highlightDir } from '@/directive'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(highlightDir)
app.use(addCopyCode)
app.mount('#app')
