<template>
  <a target="_blank" class="tracking" :href="link" v-if="isSmScreen">
    <p-tooltip
      :label="trackingNumber"
      size="large"
      position="top"
      type="dark"
      :active="trackingNumber.length > 25"
    >
      {{ truncate(trackingNumber, 25) }}
      <inline-svg
        :src="require('@/assets/img/arrow-up-right.svg')"
      ></inline-svg>
    </p-tooltip>
  </a>
  <a v-else target="_blank" class="tracking" :href="link">
    {{ trackingNumber }}
    <inline-svg :src="require('@/assets/img/arrow-up-right.svg')"></inline-svg>
  </a>
</template>
<script>
import { truncate } from '@core/utils/string'

export default {
  name: 'PackageTracking',
  props: {
    current: {
      type: Object,
      default: () => ({}),
    },
    isSmScreen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    trackingNumber() {
      if (!this.current || !this.current.tracking_number) return ''
      return this.current.tracking_number
    },
    link() {
      if (this.current.country_code == 'AU') {
        return `https://auspost.com.au/mypost/track/#/details/${this.trackingNumber}`
      }

      return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${this.trackingNumber}`
    },
  },
  methods: { truncate },
}
</script>
