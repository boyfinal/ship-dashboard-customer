<template>
  <div class="p-tabs nav-tabs-horizontal">
    <ul role="tablist" class="nav nav-tabs nav-tabs-line">
      <li
        role="presentation"
        class="nav-item"
        v-for="(item, i) in options"
        :id="getClass(i)"
        :key="i"
      >
        <a
          href="#"
          class="nav-link"
          :class="{ active: item.value === value }"
          @click.prevent="handleClick(item.value)"
        >
          {{ item.text }} ({{ item.id === 0 ? count : statics[item.id] || 0 }})
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ORDER_STATUS_TAB } from '../../constants'

export default {
  name: 'StatusTab',
  props: {
    status: {
      type: Array,
      default: () => [],
    },
    statics: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [String, Array],
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: ORDER_STATUS_TAB,
      right: 0,
      el: 0,
    }
  },
  computed: {
    count() {
      return Object.values(this.statics).reduce(
        (total, val) => (total += val),
        0
      )
    },
  },
  methods: {
    handleClick(item) {
      if (this.value !== item) {
        this.$emit('input', item)
        this.$emit('click', item)
      }
    },
    getClass(i) {
      return 'item_nav_' + i
    },
  },
}
</script>
