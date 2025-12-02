import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css';
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css'
import App from './App.vue'
import router from './router'
import { addCopyCode, highlightDir } from '@/directive'
import regisLocalPinia from '@/views/index/store/regisLocalPinia.ts'
const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(highlightDir)
app.use(addCopyCode)
app.use(VueCropper)
app.mount('#app')
regisLocalPinia()
