import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'


Vue.use(VueResource)   // 全局注册  给vue实例扩展了一个$http方法 
// Vue.config.productionTip = false

// 引入所有的styls公共样式
import "@/common/stylus/index.styl"
// 导入自己的router.js模块
import router from './router.js'
 
new Vue({
  // render:function(c){
  //   return c(App)
  // },
  render:c => c(App),
  router    // 创建和挂载跟路由到实例上
}).$mount('#app')