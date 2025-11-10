import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tran',
      component: () => import('../views/layout.vue'),
      redirect: '/tran/transfer',
      children: [
        {
          path: '/tran/transfer',
          name: 'transfer',
          meta: {
            title: '传输'
          },
          component: () => import('../views/index/index.vue'),
        },
        {
          path: '/tran/note',
          name: 'note',
          meta: {
            title: '便签'
          },
          component: () => import('../views/note/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/regis',
      name: 'regis',
      meta: {
        title: '注册'
      },
      component: () => import('../views/regis/index.vue'),
    }
  ],
})

// 路径拦截
router.beforeEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string
  }
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
