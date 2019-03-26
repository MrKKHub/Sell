import Vue from 'vue'
// 到入路由的包
import VueRouter from 'vue-router'
// 安装路由
Vue.use(VueRouter)
//导入对应的组件
import Goods from "./components/goods/goods.vue";
import Ratings from "./components/ratings/ratings.vue";
import Seller from "./components/seller/seller.vue";

//创建路由对象
var router = new VueRouter({
  routes: [      // 配置路由规则
    {path:'/',redirect:'/goods'},
    { path: "/goods", component: Goods },
    { path: "/ratings", component: Ratings },
    { path: "/seller", component: Seller }
  ],
  linkActiveClass:'router-link-active'
});

// 把路由对象暴露出去
export default router