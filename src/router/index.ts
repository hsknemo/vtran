import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
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
            activeColor: 'hsla(160, 100%, 37%, 1)',
            icon: 'StreamlineFreehandSendEmailPaperPlane1',
            title: '传个东西'
          },
          component: () => import('../views/index/transfer.vue'),
        },
        {
          path: '/tran/note',
          name: 'note',
          meta: {
            activeColor: 'gold',
            icon: 'StreamlineFreehandGraphicTabletDraw1',
            title: '写个便签'
          },
          component: () => import('../views/note/index.vue'),
        },
        {
          path: '/tran/dingDong',
          name: 'dingDong',
          meta: {
            activeColor: '#646cff',
            icon: 'StreamlineFreehandAdvertisingAdBrowser',
            title: '叮一叮'
          },
          component: () => import('../views/dingdong/dingDong.vue'),
        },
        {
          path: '/tran/bugs',
          name: 'bugs',
          meta: {
            activeColor: '#ffa034',
            icon: 'StreamlineAnnoncementMegaphone',
            title: '提个issue',
          },
          component: () => import('../views/bugs/bugs.vue'),
        },
        {
          path: '/tran/software',
          name: 'software',
          meta: {
            activeColor: '#cb64ff',
            icon: 'StreamlineFreehandHome',
            title: 'vt商店',
          },
          component: () => import('../views/softwareStore/index.vue'),
        },
        {
          path: '/tran/sponsor',
          name: 'sponsor',
          meta: {
            activeColor: '#ff3444',
            icon: 'HeroiconsOutlineHeart',
            title: '赞助',
          },
          component: () => import('../views/sponser/sponser.vue'),
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
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: '404'
      },
      component: () => import('../views/404/404.vue'),
    }
  ],
})

// 路径拦截
router.beforeEach((to, from) => {
  let devMode = import.meta.env.MODE

  if (to.meta && to.meta.title) {
    document.title =  to.meta.title + ' | Tran' as string
  }

  // 控制页面显示
  if (to.meta.mode && devMode !== to.meta.mode) {
    router.push('/404')
    return
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
