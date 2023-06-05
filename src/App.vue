<template>
  <div id="app">
    <Loading />
    <component :is="layout">
      <router-view :key="$route.name"></router-view>
    </component>
  </div>
</template>
<script>
import Loading from '@components/shared/Loading'

export default {
  name: 'App',
  data() {
    return {
      isShowScrollTop: false,
    }
  },
  metaInfo() {
    return {
      title: this.$route.meta.title || '',
      titleTemplate: '%s - Shipping',
    }
  },
  created() {
    window.onscroll = () => {
      let pos = window.pageYOffset
      if (pos > window.innerHeight) {
        this.isShowScrollTop = true
      } else {
        this.isShowScrollTop = false
      }
    }
  },
  computed: {
    layout() {
      return `${this.$route.meta.layout || 'default'}-layout`
    },
  },
  components: {
    Loading,
    'default-layout': () => import('@layouts/v2/Index'),
    'empty-layout': () => import('@layouts/v2/Empty'),
    'full-page-layout': () => import('@layouts/v2-full-page/Index'),
    'auth-layout': () => import('@layouts/auth/Index'),
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    init() {},
  },
}
</script>
