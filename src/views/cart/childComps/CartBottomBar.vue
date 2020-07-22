<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">合计:{{totalPrice}}</div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
    export default {
        name: "CartBottomBar",
      components: {CheckButton},
      computed: {
        totalPrice() {
          const cartList = this.$store.getters.cartList;
          return cartList.filter(item => {
            return item.checked
          }).reduce((preValue, item) => {
            return preValue + item.count * item.price
          }, 0).toFixed(2)
        },
        checkLength() {
          return this.$store.getters.cartList.filter((item) => item.checked).length;
        },
        isSelectAll() {
          if(this.$store.getters.cartList.length===0){
            return false;
          }
          return !(this.$store.getters.cartList.filter(item=>!item.checked).length)
        }
      },
      methods:{
        checkClick() {
          if (this.isSelectAll) {
            this.$store.getters.cartList.forEach(item=>item.checked=false)
          }else{
            this.$store.getters.cartList.forEach(item => item.checked = true);
          }
        },
        calcClick() {
          if (!this.isSelectAll) {
            this.$toast.show('请选择购买的商品');
          }
        }
      }
    }
</script>

<style scoped>
.bottom-bar{
  height: 40px;
  position: relative;
  bottom: 181px;
  margin-top: 3px;
  background-color: #eee;
  display: flex;
}
.check-content{
  display: flex;
  align-items: center;
}
  .check-button{
    width: 20px;
    height: 20px;
  }
  .price{
    margin-left: 9px;
    line-height: 40px;
    flex: 1;
  }
  .calculate {
    line-height: 40px;
    text-align: center;
    width: 100px;
    background-color: red;
  }
</style>
