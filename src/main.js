import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
const https = require('./static/http.js')
// 添加http,https的实例
Vue.prototype.$http = https.request
Vue.prototype.$https = https.requests
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
