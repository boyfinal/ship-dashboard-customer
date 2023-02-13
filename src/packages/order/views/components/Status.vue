<template>
  <span :class="className">{{ text }}</span>
</template>

<script>
import { ORDER_STATUS } from '../../constants'

export default {
  name: 'Status',
  props: {
    status: {
      type: [String, Number],
      default: () => 0,
    },
  },
  computed: {
    className() {
      const className = (ORDER_STATUS[this.status] || {}).className || 'unknown'
      return `badge badge-round badge-${className}`
    },
    text() {
      return (ORDER_STATUS[this.status] || {}).text
    },
  },
}
</script>
