<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info = "detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
    </scroll>
  </div>
</template>
  
<script>
import DetailNavBar from "./childComp/DetailNavBar";
import DetailSwiper from "./childComp/DetailSwiper";
import DetailBaseInfo from "./childComp/DetailBaseInfo";
import DetailShopInfo from "./childComp/DetailShopInfo";
import DetailGoodsInfo from './childComp/DetailGoodsInfo'
import DetailParamInfo from './childComp/DetailParamInfo'

import Scroll from "components/common/scroll/Scroll";

import { getDetail, Goods, Shop,GoodsParam } from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    Scroll,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo:{},
      paramInfo:{}
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
      this.detailInfo = data.detailInfo

      // 5、获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
    });
  },

  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
    }
  }

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
/* .content {
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
} */

.content {
    height: calc(100% - 44px);
    /* overflow: hidden; */
    /* margin-top: 44px; */
  }
</style>