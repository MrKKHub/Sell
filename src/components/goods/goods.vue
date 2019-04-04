<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item,index) in goods"
          :key="index"
          class="menu-item"
          :class="{'current':currentIndex===index}"
          @click="selectMenu(index,$event)"
        >
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{ item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list" ref="foodListHook">
          <h1 class="title">{{ item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px"
             @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt>
              </div>
              <div class="content">
                <h2 class="name">{{ food.name}}</h2>
                <p class="desc">{{ food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>&nbsp;
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart 
    ref="shopcart"
    :selectFoods="selectFoods"
    :delivery-price="seller.deliveryPrice" 
    :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import shopcart from '../shopcart/shopcart.vue'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood:{}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods(){
      let foods = [];
      this.goods.forEach(item =>{
        item.foods.forEach(food => {
          if(food.count){
            foods.push(food);
          }
        })
      })
      return foods
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];

    this.$http.get("http://127.0.0.1:3000/api/goods").then(response => {
      response = response.body;
      console.log(response); // 拿到数据了
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        // console.log(this.goods);
        this.$nextTick(() => {
          this._initScroll(); // 初始化_initScroll()方法
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: "true"             //传入这个属性后可以点击
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,     //传入这个属性 在滚动时获得实时位置
        click: "true" 
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodListHook;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      // console.log(index, event);
      let foodList = this.$refs.foodListHook;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 500);
    },
    selectFood(food,event){
      this.selectedFood = food;
      this.$refs.food.show();
    },
    _drop(dom){
      // 调用shopCart组件的事件
      this.$refs.shopcart.drop(dom);
    }
  },
  components:{
    shopcart,
    cartcontrol
  },
  events:{
    'cart.add'(target){
      this._drop(target)
    }
  }
};
</script>
 
<style lang="stylus">
@import '../../common/stylus/mixin.styl';


.goods {
  display: flex;
  position: absolute;
  top: 174px; // header 134px +  tab 40px
  bottom: 46px; // 底部选购商品栏的高度
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px; // 三个属性 1等分 2.内容缩放情况 3占位空间
    width: 80px;
    background-color: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background-color: #fff;
        font-weight: 700;
        .text{
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;
    font-size: 14px;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
      margin: 0;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: #07111b;
        }

        .desc {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);

          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .cartcontrol-wrapper{
            position absolute
            right 0
            bottom 12px
        }
      }
    }
  }
}
</style>