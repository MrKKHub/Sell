<template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="cart-decrease icon-remove_circle_outline"
        v-show="food.count>0"
        @click.stop.prevent="decreaseCart"
      ></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{this.food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      default: {}
    }
  },
  methods: {
    addCart(e) {
      // console.log("dianji");

      // food是对象 必须通过this,$set才能检测到food属性发生改变
      this.$set(this.food, "count", this.food.count ? this.food.count + 1 : 1);
      // console.log(this.food.count);
      this.$emit("cart.add", event.target); // 向父组件发出add事件
    },
    decreaseCart() {
      this.$set(this.food, "count", this.food.count ? this.food.count - 1 : 0);
    }
  }
};
</script>

<style lang="stylus">
.cartcontrol {
  font-size: 0;

  .cart-decrease, .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
  }
}

.move-enter-active { // 添加控件移动和旋转动画
  transition: all 0.3s linear;
}

.move-enter {
  opacity: 0;
  transform: translateX(50px) rotate(360deg);
}

.move-leave-active {
  transition: all 0.3s linear;
  opacity: 0;
  transform: translateX(50px) rotate(360deg);
}
</style>
