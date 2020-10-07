import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')


// console.log('aaa');

// 没有给定延时时间
// setTimeout(()=>{
//   console.log('bbb');
// })

// console.log('ccc');

// setTimeout也是最后执行，js中有一个事件循环概念，只要是setTieout都会被加入到下一次事件循环尾部执行
// 执行顺序 aaa-> bbb -> ccc