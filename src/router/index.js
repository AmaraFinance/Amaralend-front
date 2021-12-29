import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    component: Layout,
    children: [{
        path: '',
        component: () => import('@/views/main/main'),
        name: 'main'
      },
      {
        path: '/farm',
        component: () => import('@/views/farm/farm'),
        name: 'farm'
      },
      {
        path: '/stake',
        component: () => import('@/views/stake/stake'),
        name: 'stake'
      },
      {
        path: '/dao',
        component: () => import('@/views/dao/dao'),
        name: 'dao'
      },
      {
        path: '/asset',
        component: () => import('@/views/asset/asset'),
        name: 'asset'
      }
    ]
  }]
})
