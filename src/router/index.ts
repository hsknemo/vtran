import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index/index.vue'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/regis',
      name: 'regis',
      component: () => import('../views/regis/index.vue'),
    }
  ],
})

// 路径拦截
router.beforeEach((to, from) => {
  // 注册页面不拦截
  if (to.name === 'regis' || to.name === 'login') {
    localStorage.removeItem('Auth')
    localStorage.removeItem('user')
    return true
  }
  const auth = localStorage.getItem('Auth')
  const user = localStorage.getItem('user')
  if (!auth && to.name !== 'login') {
    ElMessage.error('登录信息过期~')
    return { name: 'login' }
  }
  if (!user && to.name !== 'login') {
    ElMessage.error('登录信息过期~')
    return { name: 'login' }
  }
  // 返回 false 以取消导航
  return true
})

export default router
