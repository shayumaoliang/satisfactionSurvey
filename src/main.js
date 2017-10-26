// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from '../config'
import IEcharts from 'vue-echarts-v3/src/full.vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'
import ElementUI from 'element-ui'

Vue.use(VueAxios, axios)
Vue.component(IEcharts.name, IEcharts)

Vue.use(ElementUI)
Vue.use(Iview)

Vue.prototype.$apiUrl = process.env.NODE_ENV === 'development'
? JSON.parse(config.dev.env.BASE_API)
: JSON.parse(config.build.env.BASE_API)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
