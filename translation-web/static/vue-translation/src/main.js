// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import store from './store'

// 引入Element-UI
import ElementUI from 'element-ui'
import '../static/css/element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'

// 引入全局scss
import '../static/css/main.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
