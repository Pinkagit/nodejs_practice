import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// pages && components
import home from "@/pages/home"
import search from "@/components/search"
import logs from "@/components/logs"

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      redirect: '/search',
      children: [
        {
          path: '/search',
          component: search,
          name: 'search'
        },
        {
          path: '/logs',
          component: logs,
          name: 'logs'
        }
      ]
    }
  ]
})
