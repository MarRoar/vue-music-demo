<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: 'slider',
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      let _this = this
      setTimeout(() => {
        _this._setSliderWidth() // 初始化图片的宽度
        _this._initDots()       // 初始化点
        _this._initSlider()

        if (_this.autoPlay) {
          _this._play()
        }
      }, 20)

      window.addEventListener('resize', () => {

        if (!_this.slider) {
          return
        }
        _this._setSliderWidth(true)
        _this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isReset) {
        /*
          计算轮播图外面那个大盒子的宽度
         */
        let _this = this;
        _this.children = _this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = _this.$refs.slider.clientWidth
        for (let i = 0; i < _this.children.length; i++) {
          let child = _this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'

          width += sliderWidth
        }
        // 无缝滚动要在前后面加宽度
        if (_this.loop && !isReset) {
          width += 2*sliderWidth
        }

        _this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        let _this = this
        _this.slider = new BScroll(_this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          snap: true,
          snapLoop: true,
          snapThreshold: 0.3,
          snapSpeed: 400,
          momentum: true
        })
        _this.slider.on('scrollEnd', () => {
          let pageIndex = _this.slider.getCurrentPage().pageX
          if (_this.loop) {
            pageIndex -= 1
          }
          _this.currentPageIndex = pageIndex

          if (_this.autoPlay) {
            clearTimeout(_this.timer)
            _this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        let _this = this
        let currentIndex = _this.currentPageIndex + 1

        if (_this.loop) {
          currentIndex += 1
        }
        _this.timer = setTimeout(() => {
          _this.slider.goToPage(currentIndex, 0, 400)
        }, _this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position: relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
