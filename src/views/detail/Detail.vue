<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- 标签不区分大小写 -->
      <!-- 属性：topImage 传入值：top-image -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commenetInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>

    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>
  
<script>
import DetailNavBar from "./childComp/DetailNavBar";
import DetailSwiper from "./childComp/DetailSwiper";
import DetailBaseInfo from "./childComp/DetailBaseInfo";
import DetailShopInfo from "./childComp/DetailShopInfo";
import DetailGoodsInfo from "./childComp/DetailGoodsInfo";
import DetailParamInfo from "./childComp/DetailParamInfo";
import DetailCommentInfo from "./childComp/DetailCommentInfo";
import DetailBottomBar from "./childComp/DeatilBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodList";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commenetInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
    };
  },
  created() {
    // 1、保存存下的iid
    this.iid = this.$route.params.iid;

    // 2、根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      console.log(res);
      // 1、获取顶部的轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;
      // console.log();

      // 2、获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3、创建店铺信息对象
      this.shop = new Shop(data.shopInfo);

      // 4、保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5、获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6、取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commenetInfo = data.rate.list[0];
      }

      /*
      // $nextTick，等到前面组件真正渲染完以后，会执行回调函数，此时offsetTop有值了
      this.$nextTick(() => {
        // 2、第二次获取，值不对
        //原因：图片没有计算在内
        // 根据最新的数据u，对应的DOM是已经被渲染出来了
        // 但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
        // offsetTop值不对的时候，一般情况下，都是因为图片的问题
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);
      });

      // 第一次获取，值不对
      // 值不对的原因：this.$refs.param.$el压根没有渲染
      // 上面确实已经给组件赋完数据，但是需要渲染组件的时间，所以此时offsetTop还是为undefined
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs);
      */
    });

    // 3、请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },

  mounted() {
    // 数据在created中异步请求，此时在mounted中不一定拿得到数据
    // DeatilParamInfo.vue拿不到数据，跟组件不会渲染
    //根组件没有渲染，$el.offSetTop拿不到数据
    // this.themeTopYs.push(0)
    // this.themeTopYs.push(this.$refs.param.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    // console.log(this.themeTopYs);
  },
  // updated(){

  //   this.themeTopYs = []
  //   this.themeTopYs.push(0)
  //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  //   console.log(this.themeTopYs);
  // },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {

    ...mapActions(['addCart']),

    imageLoad() {
      this.$refs.scroll.refresh();

      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },

    contentScroll(position) {
      // console.log(position);
      // 1、获取y值
      const positionY = -position.y;

      // 2、positionY和主题中的值进行对比
      // Number.MAX_VALUE vue中的最大值
      // this.themeTopYs:[0, 2624, 3990, 4186, __ob__: Observer, 非常大的值]
      // positionY 在 0 和 2624 之间 index=0
      // positionY 在 2624 和 3990 之间 index=1
      // positionY 在 3990 和 4186 之间 index=2
      // positionY 在 4186 和 一个非常大的值之间 index=3

      // positionY 大于 4186 index=3
      // for (let i in this.themeTopYs) {
      // 会有数组越界的情况 i+1
      let length = this.themeTopYs.length;
      // for (let i = 0; i < length; i++) {
      for (let i = 0; i < length - 1; i++) {
        // console.log(i); //str
        // parseInt(i)//要是i转换成number，i+1才不会错
        // if (
        //   positionY > this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[i + 1]
        // ) {
        //   console.log(i);
        // }

        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }

        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   // console.log(i);
        //   this.currentIndex = i;
        //   // console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
      }

      // 3、是否显示回到顶部
      this.listenShowBackTop(position);
    },

    addToCart() {
      // console.log("---");
      // 1、获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.nowPrice;
      product.iid = this.iid;

      // 2、将商品添加到购物车界面
// actions补充，1、返回promise 2、mapActions
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      this.addCart(product).then(res=>{
        console.log(res);
      })
      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res);
      // })

    },
  },
};
</script>
  
<style scoped>
#detail {
  position: relative;
  height: 100vh;
  background-color: #fff;
  z-index: 9;
}
.detail-nav {
  /* 不要随便用absolute和fixed，因为relative还保持在自己原来的位置，用来设置层级比较好 */
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
}

/* .content {
  height: calc(100% - 44px - 49px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>