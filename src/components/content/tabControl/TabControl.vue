<template>
    <div class="tab-control">
      <div class="tab-control-item" v-for="(title,index) in titles"
           :key="index" :class="{active:index===currentIndex}"
      @click="btnClick(index)">
        <span>{{title}}</span>
      </div>
    </div>
</template>

<script>
    export default {
      name: "TabControl",
      props:{
        titles:{
          type:Array,
          default() {
            return [];
          }
        }
      },
      data() {
        return {
          currentIndex:0
        }
      },
      methods:{
        btnClick(index) {
          this.currentIndex=index;
          this.$emit("tabClick", index);
        }
      }
    }
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
    background-color: #fff;
    z-index: 9;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 2px solid var(--color-high-text);
  }
</style>
