<template>
  <div class="loading">
    <img src="./loading.gif" height="24" width="24" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '加载中...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .loading
    text-align: center
    width: 100%
    .desc
      line-height: 25px
      font-size: $font-size-small
      color: $color-text-l

</style>
