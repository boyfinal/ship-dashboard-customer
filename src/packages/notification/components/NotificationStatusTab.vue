<template>
  <div class="p-tabs nav-tabs-horizontal">
    <ul role="tablist" class="nav nav-tabs nav-tabs-line">
      <li
        role="presentation"
        class="nav-item"
        v-for="(item, i) in cleanStatus"
        :key="i"
      >
        <a
          href="#"
          class="nav-link first"
          :class="{ active: item.value === value }"
          @click.prevent="handleClick(item.value)"
          v-if="i == 0"
        >
          <inline-svg v-if="item.value" :src="getIcon(item.value)"></inline-svg>
          {{ item.text }} ({{ caculateTotal }})
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ active: item.value === value }"
          @click.prevent="handleClick(item.value)"
          v-else-if="mapCount.length != 0"
        >
          <inline-svg v-if="item.value" :src="getIcon(item.value)"></inline-svg>
          <div class="text-status">
            {{ item.text }} ({{
              mapCount[i - 1].count != null
                ? mapCount[i - 1].count
                : 0 | numFormatter
            }})
          </div>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ active: item.value === value }"
          @click.prevent="handleClick(item.value)"
          v-else
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { capitalize } from '@core/utils/string'
import { numFormatter } from '@core/utils/formatter'
import {
  NOTIFY_TYPE_ORDER_UPDATE,
  NOTIFY_TYPE_FINANCE_UPDATE,
  NOTIFY_TYPE_ANNOUNCEMENT,
  NOTIFY_TYPE_SERVICE_UPDATE,
  NOTIFY_TYPE_PROMOTION,
} from '../constant'

export default {
  name: 'NotificationStatusTab',
  props: {
    status: {
      type: Object,
      default: () => {},
    },
    value: {
      type: String,
      default: '',
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
    count: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    cleanStatus() {
      const status = this.hasAll ? [{ value: '', text: 'Tất cả' }] : []

      const listStatus = Object.keys(this.status)
      const listValues = Object.values(this.status)

      for (let i = 0; i < listStatus.length; i++) {
        status.push({
          value: String(listValues[i]),
          text: capitalize(listStatus[i]),
        })
      }

      return status
    },
    caculateTotal() {
      const arr = this.count.map((ele) => ele.count)
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const total = arr.reduce(reducer, 0)
      return numFormatter(total)
    },
    mapCount() {
      if (this.count.length < 1) {
        return []
      }
      const listValuesOfStatus = Object.values(this.status)

      const count = [...listValuesOfStatus]
      for (let i = 0; i < listValuesOfStatus.length; i++) {
        for (let j = 0; j < this.count.length; j++) {
          if (listValuesOfStatus[i] == this.count[j].status) {
            count[i] = this.count[j]
            break
          }
        }
      }
      return count
    },
  },
  methods: {
    handleClick(item) {
      if (this.$parent.$data.filter.page) {
        this.$parent.$data.filter.page = 1
      }
      if (this.value !== item) {
        this.$emit('input', item)
        this.$emit('click', item)
      }
    },
    getIcon(type) {
      type = parseInt(type)
      switch (type) {
        case NOTIFY_TYPE_ORDER_UPDATE:
          return require('../../../../src/assets/img/order_update_notify.svg')
        case NOTIFY_TYPE_FINANCE_UPDATE:
          return require('../../../../src/assets/img/finance_update_notify.svg')
        case NOTIFY_TYPE_ANNOUNCEMENT:
          return require('../../../../src/assets/img/announcement_notify.svg')
        case NOTIFY_TYPE_SERVICE_UPDATE:
          return require('../../../../src/assets/img/service_notify.svg')
        case NOTIFY_TYPE_PROMOTION:
          return require('../../../../src/assets/img/promotion_notify.svg')
        default:
          return require('../../../../src/assets/img/no_type_notify.svg')
      }
    },
  },
}
</script>
