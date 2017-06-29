<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :probeType="probeType"
          :listenScroll="listenScroll"
          @scroll="scroll"
          >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="items in group.items" class="list-group-item">
            <img v-lazy="items.avatar" class="avatar" alt="">
            <span class="name">{{items.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.top.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
          v-for="(item, index) in shortcutList"
          :class="{'current': currentIndex === index}"
          :data-index="index">
          {{index}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  const ANCHOR_HEIGHT = 18

  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index') - 0
        let firstTouch = e.touches[0] - 0
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        console.log("onShortcutTouchStart", anchorIndex)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        /*
          通过计算刚开始点下的索引，anchorIndex 然后再移动的时候。计算又移动了几个索引
         */
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        console.log("anchorIndex", anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        console.log("index", index)

        this.scrollY = -this.listHeight[index]

        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        /*检测data的变化去改变计算高度，也就是计算每个listGroup从他的位置到顶部的高度*/
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (var i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到上面的时候
        console.log("之前", this.currentIndex)
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 当滚动到中间部分的时候
        //
        for (var i = 0; i < listHeight.length -1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY <= height2) {
            this.currentIndex = i
            console.log("之中", this.currentIndex)
            return
          }
        }

        // 当滚动到下面的时候
        this.currentIndex = listHeight.length - 2
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 30px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-sieze-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>