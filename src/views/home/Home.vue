<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />

    <!-- @scroll、@pullingUp子传父 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <good-list :goods="showGoods" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";

import { debounce } from "common/utils";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  destroyed() {
    console.log("跳转");
  },
  activated() {
    // console.log("activated");
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log("deactivated");
    this.saveY = this.$refs.scroll.getScrollY();
  },
  created() {
    // 1.请求多个数据
    // 因为是同名函数，因为要调methods中的方法，所以要加this，如果不加，调用的将会是import的方法
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

    // 监听最好不要在create里完成，因为很有可能拿不到this.$refs.scroll
    // // 3、监听item中图片加载完成
    // this.$bus.$on("itemImageLoad", () => {
    //   // console.log("---");
    //   this.$refs.scroll.refresh();
    // });
  },

  mounted() {
    //1、图片加载完成的事件监听
    // 用防抖动函数解决refresh频繁调用的问题
    const refresh = debounce(this.$refs.scroll.refresh, 200);

    // 这里可以保证监听到的时候，this.$refs.scroll是有值的
    // 3、监听item中图片加载完成
    this.$bus.$on("itemImageLoad", () => {
      // console.log("---");
      refresh();
      // this.$refs.scroll.refresh();
    });

    // 2、获取tabControl的offsetTop
    // 所有的组件都有一个属性$el,用来获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
  },
  methods: {
    /**
     * 事件监听相关的方法
     */

    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    backClick() {
      // console.log('回到');
      // this.$refs.scroll-->scroll组件
      // 组件.scroll-->scroll组件里的scroll对象数据（data数据）
      // 对象.scrollTop-->对象调方法
      // scrollTop参数：x坐标，y坐标，时间单位是毫秒
      // this.$refs.scroll.scroll.scrollTo(0,0,500)

      // this.$refs.scroll组件
      // 组件.scrollTo--->组件直接调用里面封装的方法
      this.$refs.scroll.scrollTo(0, 0);
    },

    //
    contentScroll(position) {
      // console.log(position);
      // 1、判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
      // 2、决定TabControl是否吸顶（position:fixed）
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    loadMore() {
      // 加载更多的方法
      this.getHomeGoods(this.currentType);
    },

    swiperImageLoad() {
      // 2、获取tabControl的offsetTop
      // 所有的组件都有一个属性$el,用来获取组件中的袁旭
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上垃圾在更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 正在使用浏览器原生滚动时，为了让导航不跟随网页滚动而使用的 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
/* .content {
    height: calc(100% - 100px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>
