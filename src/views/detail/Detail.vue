<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
      <scroll class="content"ref="scroll" @scroll="contentScroll" :probe-type="3">
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @itemImageLoad="itemImageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"/>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
   <!--   <toast :message="message" :show="show"/>-->
    </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail, Goods, Shop,GoodsParam,getRecommend} from "../../network/detail";
  import {debounce} from "../../common/utils/utils";
  import {itemListenerMixin,backTopMixin} from "../../common/utils/mixin";
/*
  import Toast from "components/common/toast/Toast";*/
  export default {
      name: "Detail",
      components: {
        /*Toast,*/
        DetailSwiper,
        DetailNavBar,
        DetailBaseInfo,
        DetailShopInfo,
        DetailBottomBar,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        Scroll
      },
    mixins: [itemListenerMixin,backTopMixin],
      data() {
        return {
          iid:null,
          topImages:[],
          goods:{},
          shop:{},
          detailInfo:{},
          paramInfo:{},
          commentInfo: {},
          recommends: [],
          themeTopYs: [],
          getThemeTopY: null,
          currentIndex:0,
         /* message:'',
          show:false*/
        };
      },
      created() {
        this.iid = this.$route.params.iid;
        getDetail(this.iid).then(res=>{
          const data=res.result
          this.topImages = data.itemInfo.topImages;
          this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)
          this.shop = new Shop(data.shopInfo);
          this.detailInfo=data.detailInfo
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
          if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0];
          }

          /*this.$nextTick(()=>{

          })*/

        })

        getRecommend().then(res=>{
          this.recommends=res.data.list;
        })

        this.getThemeTopY=debounce(()=>{
          this.themeTopYs = [];
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44);
        },100)
      },
      methods:{
        addToCart() {
          //获取商品信息
          const product = {};
          product.image = this.topImages[0];
          product.title = this.goods.title;
          product.desc = this.goods.desc;
          product.price = this.goods.nowPrice;
          product.iid = this.iid;
          //加入购物车
          this.$store.dispatch('addCart', product).then(res=>{
          /*  this.show=true
            this.message=res
            setTimeout(()=>{
              this.show = false;
              this.message=''
            },1500)*/
            this.$toast.show(res,2000)

          })

        },
        itemImageLoad() {
          this.$refs.scroll.refresh();
          this.getThemeTopY();
        },
        titleClick(index) {
          this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
        },
        contentScroll(position) {
          const positionY=-position.y;
          let length = this.themeTopYs.length;
          for (let i = 0; i < this.themeTopYs.length; i++) {
            if (this.currentIndex!=i&&((i < length - 1) &&( positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
              || ((i == length - 1) && positionY >= this.themeTopYs[i]))) {
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex;
            }
          }
          this.listenerBackTop(position);
        }
      },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener);
    }
  }
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 66;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 8;
  background-color: #fff;
}
  .content {
    height: calc(100% - 93px);

  }
</style>
