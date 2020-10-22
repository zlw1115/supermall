import BackTop from "components/content/backTop/BackTop";
import { debounce } from "common/utils";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log('我是混入中的内容');
  }
}


export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false,
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    listenShowBackTop(position){
      this.isShowBackTop = -position.y > 1000;
    }
  }
}