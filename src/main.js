import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'

import 'babel-polyfill'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'

// 点击300毫秒的延迟
fastclick.attach(document.body)


Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
