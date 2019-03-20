import Vue from 'vue'
import axios from 'axios'
import store from './store'

// 引入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

const app = new Vue()

let ajax = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 请求拦截
ajax.interceptors.request.use(
    // 请求发送前
    config => {
        // 如果TOKEN存在，每个http header都加上TOKEN
        if (store.state.TOKEN) {
            config.headers.Authorization = `token ${store.state.TOKEN}`
        }
        return config;
    }
)

// 响应拦截
ajax.interceptors.response.use(
    response => {
        if (response.data.sta == -1) {
            app.$message.error(response.data.msg);
        } else if (response.data.sta == 1) {
            app.$message.success(response.data.msg);
        }
        
        return response;
    },
    error => {
        if (error.response) {

            console.log(error.response);
            switch (error.response.status) {
                case 401:
                    store.commit('LOGOUT')      // 清除token
                    app.$message.warning("你已退出登入！");
                    break;
                default:
                    app.$message.error(error.response.statusText);
            }
        }

        return Promise.reject(error.response)
    }
)

export default {
    // 用户登入
    userLogin(params) {
        return ajax.post('/api/login', params)
    },
    // 获取languageList
    getLanguageList() {
        return ajax.get('/api/languagelist')
    },
    // search
    searchLanguage(params) {
        return ajax.post('/api/search', params)
    },
    // update
    update(params) {
        return ajax.post('/api/update', params)
    },
    // 查询logs
    getLosg(params) {
        return ajax.post('/api/logs', params)
    }
}