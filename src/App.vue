<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-itme">
        <router-link to="/goods">商品</router-link>
        </div>
      <div class="tab-itme">
        <router-link to="/ratings">评论</router-link>
        </div>
      <div class="tab-itme">
        <router-link to="/seller">商家</router-link>
        </div>
    </div>
      <keep-alive>
      <router-view :seller="seller"></router-view>
      </keep-alive>
  </div>
</template>

<script>
import {urlParse} from "./common/js/util.js"
import header from './components/header/header'
var ERR_OK = 0;
export default{

  data(){
    return{     //返回一个对象
      seller:{
         id: (() => {
          let queryParam = urlParse();
          return queryParam.id; //https://xxx.com/sell/index.html?id=666#/goods  获取url上的参数id
        })()
      },
    }
  },
  created(){
      this.$http.get('http://127.0.0.1:3000/api/seller').then((response) => {
        // response = response.json();   返回的是一个Promise 对象
        response = response.body;
        // console.log(response)  拿到数据了
        if(response.errno === ERR_OK){
            this.seller = response.data
            // console.log(this.seller)
        }
      })
  },
  components:{
    "v-header":header
  }
}
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"
  .tab
    display:flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px:(rgba(7,17,27,0.1))
    .tab-itme
      flex: 1 
      text-align: center
      & > a
        display: block
        text-decoration:none 
        font-size: 14px
        color: rgb(77,85,93)
      &  .router-link-active
        color: rgb(240,20,20)

</style>
