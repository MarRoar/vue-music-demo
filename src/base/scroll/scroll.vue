<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        defaylt: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      var _this = this
      setTimeout(() => {
        _this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        var _this = this
        if (!_this.$refs.wrapper) {
          return
        }
        _this.scroll = new BScroll(_this.$refs.wrapper, {
          probeType: _this.probeType,
          click: _this.click,
        })
        if (this.listenScroll) {
          _this.scroll.on('scroll', (pos) => {
            _this.$emit('scroll', pos)
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        var _this = this
        setTimeout(() => {
          _this.scroll.refresh()
        }, 20)
      }
    }
  }
</script>
