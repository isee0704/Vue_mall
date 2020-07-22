import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'fastclick'

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

Vue.use(toast)

//解决移动端300ms延迟
FastClick.attach(document.body);

//图片懒加载
Vue.use(VueLazyLoad,{
  loading:'http://cdn.shyoc.com/img/20200714100006.png'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
