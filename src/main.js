import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

// 解决移动端的300ms的延时
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


// console.log('aaa');

// 没有给定延时时间
// setTimeout(()=>{
//   console.log('bbb');
// })

// console.log('ccc');

// setTimeout也是最后执行，js中有一个事件循环概念，只要是setTieout都会被加入到下一次事件循环尾部执行
// 执行顺序 aaa-> bbb -> ccc