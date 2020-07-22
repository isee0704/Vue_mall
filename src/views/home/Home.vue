<template>
    <div id="home">
      <nav-bar class="home-nav">
        <div slot="center">购物街</div>
      </nav-bar>
      <tab-control  :titles="['流行','新款','精选']" v-show="isTabFixed" @tabClick="tabClick" ref="tabControl0" class="tab-control"/>
      <scroll class="content" ref="scroll" :probeType="3" :pullUpLoad="true" @pullingUp="pullingUp" @scroll="contentScroll">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl"/>
        <goods-list :goods="showGoods"/>
      </scroll>

      <back-top @click.native="backClick" v-show="isShowBackTop"/>

    </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";


  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";

  import {getHomeMultidata,getHomeData} from "network/home";
  import {itemListenerMixin,backTopMixin} from "common/utils/mixin";

  export default {
    name: "Home",
    components: {
      Scroll,
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList
    },
    data() {
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    created() {
      this.getHomeMultidata();
      this.getHomeData('pop');
      this.getHomeData('new');
      this.getHomeData('sell');
    },
    mixins: [itemListenerMixin,backTopMixin],
    mounted() {

    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    methods: {
      /**
       *事件监听相关的方法
       */
      swiperImageLoad() {
        this.tabOffsetTop=this.$refs.tabControl.$el.offsetTop;
      },
      pullingUp() {
        this.getHomeData(this.currentType);
      },
      contentScroll(position) {
        this.listenerBackTop(position);
        this.isTabFixed = (-position.y) > this.tabOffsetTop;
      },
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType='pop';
            break;
          case 1:
            this.currentType='new';
            break;
          case 2:
            this.currentType='sell';
            break;
        }
        this.$refs.tabControl0.currentIndex=index;
        this.$refs.tabControl.currentIndex=index;
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res=>{
          this.banners=res.data.banner.list;
          this.recommends=res.data.recommend.list;
        })
      },
      getHomeData(type) {
        const page=this.goods[type].page+1;
        getHomeData(type, page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          this.$refs.scroll.finishPullUp();
        });

      }
    }
  }
</script>

<style scoped>
  #home{
   /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

   /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 99;*/
  }
  .tab-control{
    position: relative;
    z-index: 55;
    margin-top: -3px;
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
