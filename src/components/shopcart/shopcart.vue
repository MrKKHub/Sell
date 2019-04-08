<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount > 0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></span>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount > 0}">￥{{totalPrice}}</div>
          <div class="desc">需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" id="list-content">
            <ul>
              <li v-for="(food,index) in selectFoods" class="food" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="drop" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <!--购物车小球-->
      <div class="ball-container">
        <div v-for="(ball,index) of balls" :key="index">
          <transition
            @before-enter="handleBeforeEnter"
            @enter="handleEnter"
            @after-enter="handleAfterEnter"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from "@/components/cartcontrol/cartcontrol.vue";
import BScorll from "better-scroll";
export default {
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [{}];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        //  列表展示的时候需要初始化BScroll重新计算列表高度
        this.$nextTick(() => {
          //必须写在这里面 才能 获取到DOM
          if (!this.scroll) {
            this.scroll = new BScorll(document.getElementById("list-content"), {
              click: "true"
            });
          } else {
            this.scroll.refresh(); //如果scroll存在就不要重新new 只需refresh更新就行2
          }
        });
      }

      return show;
    }
  },
  methods: {
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach(item => {
        item.count = 0;
      });
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    },
    drop(dom) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = dom;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    handleBeforeEnter: function(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); // getBoundingClientRect()获取小球相对于视窗的位置，屏幕左上角坐标为0，0
          let x = rect.left - 32; // 小球x方向位移= 小球距离屏幕左侧的距离-外层盒子距离水平的距离
          let y = -(window.innerHeight - rect.top - 22); // 负数，因为是从左上角向下
          el.style.transform = `translate3d(0,${y}px,0)`; // 设置外层盒子，即小球垂直方向的位移
          let inner = el.firstElementChild;
          inner.style.transform = `translate3d(${x}px,0,0)`; // 设置内层盒子，即小球水平方向的距离
        }
      }
    },
    handleEnter: function(el, done) {
      // 触发浏览器重绘
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        // 让动画效果异步执行,提高性能
        el.style.transform = "translate3d(0, 0, 0)"; // 设置小球掉落后最终的位置
        let inner = el.firstElementChild;
        inner.style.transform = "translate3d(0, 0, 0)";
        el.addEventListener("transitionend", done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。它可以是transitionend或 animationend
      });
    },
    handleAfterEnter: function(el) {
      let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus">
@import '~@/common/stylus/mixin.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  background: #000;

  .content {
    display: flex;
    // background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background-color: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }
      }

      .num {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 16px;
        font-size: 9px;
        font-weight: 700;
        color: #fff;
        background-color: rgb(240, 20, 20);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin: 12px 0 0 12px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        background-color: #2b333b;

        &.not-enough {
          background-color: #2b333b;
        }

        &.enough {
          background-color: #00b43c;
          color: #fff;
        }
      }
    }
  }

  .shopcart-list {
    position: absolute;
    padding-bottom: 48px;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;

    .list-header {
      height: 40px;
      // line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
        line-height 22px;
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
        line-height 40px;
      }
    }

    .list-content {
      width: 100%;
      padding-left: 5px;
      max-height: 217px;
      background: #fff;
      overflow: hidden;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-weight: 700;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: rgba(7, 17, 27, 0.6);
    backdrop-filter: blur(5px);
  }

  .ball-container {
    .ball {
      position: fixed;
      left: -30px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.3s cubic-bezier(0.49, -0.29, 0.75, 0.41); // 外出过度

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(0, 160, 220);
        transition: all 0.4s linear; // 内层过度
      }
    }
  }
}

.fade-enter { // 背景层淡入淡出动画
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-active {
  transition: all 0.5s;
  opacity: 0;
}

.fold-enter { // 购物车淡入淡出和上下移动动画
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}

.fold-enter-active {
  transition: all 0.5s;
}

.fold-leave-active {
  transition: all 0.5s;
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
</style>