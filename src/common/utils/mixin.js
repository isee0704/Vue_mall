import {debounce} from "common/utils/utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data(){
    return{
      itemImgListener:null
    }
  },
  //监听图片加载
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on('itemImageLoad', this.itemImgListener);
  }
};

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0,200);
    },
    listenerBackTop(pos) {
      this.isShowBackTop = (-pos.y) > 1000;
    }
  }
};
