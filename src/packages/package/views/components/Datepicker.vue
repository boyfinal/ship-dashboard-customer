<template>
  <date-range-picker
    ref="picker"
    :opens="opens"
    :locale-data="localeData"
    :minDate="minDate"
    :maxDate="maxDate"
    :maxSpan="maxSpan"
    :singleDatePicker="false"
    :timePicker="timePicker"
    :timePicker24Hour="timePicker24Hour"
    :showWeekNumbers="showWeekNumbers"
    :showDropdowns="showDropdowns"
    :autoApply="autoApply"
    v-model="dateRange"
    @update="updateValues"
    @toggle="checkOpen"
    :linkedCalendars="linkedCalendars"
    :dateFormat="dateFormat"
    :close-on-esc="true"
    :ranges="ranges"
  >
    <div slot="input" slot-scope="picker" style="width: 100%">
      <img
        src="@assets/img/calendar.svg"
        style="float: right; margin-left: 2px; margin-top: 9px"
      />
      <span
        class="label-date-picker"
        v-if="
          dateRange.startDate === dateRange.endDate &&
            dateRange.startDate === ''
        "
      >
        {{ label }}
      </span>
      <span
        v-else-if="
          picker.startDate &&
            picker.endDate &&
            picker.startDate != picker.endDate &&
            !singleDatePicker
        "
      >
        {{ picker.startDate | date('dd/MM/yyyy') }} ~
        {{ picker.endDate | date('dd/MM/yyyy') }}
      </span>
      <span
        v-else-if="
          dateRange.startDate &&
            dateRange.endDate &&
            picker.startDate != picker.endDate &&
            !singleDatePicker
        "
      >
        {{ dateRange.startDate | date('dd/MM/yyyy') }} ~
        {{ dateRange.endDate | date('dd/MM/yyyy') }}
      </span>
      <span class="label-date-picker" v-else>{{ label }}</span>
      <span
        class="clear-date"
        v-if="dateRange.startDate && dateRange.endDate"
        @click="clear"
      >
        <inline-svg :src="require('@assets/img/closesm.svg')"></inline-svg>
      </span>
    </div>
    <template
      v-slot:footer="{ autoApply, clickCancel, in_selection, clickApply }"
    >
      {{ in_selection }}
      <div class="drp-buttons" v-if="!autoApply">
        <button
          class="cancelBtn btn btn-sm btn-secondary"
          type="button"
          @click="clickCancel"
          >Cancel
        </button>
        <button
          class="applyBtn btn btn-sm btn-success"
          :disabled="in_selection"
          type="button"
          @click="clickApplyCreate(clickApply)"
          >Created date
        </button>
        <button
          class="applyBtn btn btn-sm btn-success"
          :disabled="in_selection"
          type="button"
          @click="clickApplyAccept(clickApply)"
          >Accepted date
        </button>
      </div>
    </template>
  </date-range-picker>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
export { date } from '@core/utils/datetime'

export default {
  name: 'Datepicker',
  components: { DateRangePicker },
  props: {
    value: {},
    label: {
      type: String,
      default: 'Date',
    },
    singleDatePicker: {
      type: Boolean,
      default: false,
    },
    timePicker: {
      type: Boolean,
      default: false,
    },
    opens: {
      type: String,
      default: 'left',
    },
    minDate: {
      type: [String, Date],
      default: '',
    },
    maxDate: {
      type: [String, Date],
      default: '',
    },
    maxSpan: {
      type: String,
      default: '',
    },
    timePicker24Hour: {
      type: Boolean,
      default: true,
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    showDropdowns: {
      type: Boolean,
      default: false,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    linkedCalendars: {
      type: Boolean,
      default: true,
    },
    dateFormat: {
      type: Function,
      default: null,
    },
    localeData: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
    ranges: {
      type: [Boolean, Object],
      default() {
        let today = new Date()
        today.setHours(0, 0, 0, 0)

        let yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

        return {
          Today: [today, today],
          Yesterday: [yesterday, yesterday],
          'This month': [
            new Date(today.getFullYear(), today.getMonth(), 1),
            new Date(today.getFullYear(), today.getMonth() + 1, 0),
          ],
          'This year': [
            new Date(today.getFullYear(), 0, 1),
            new Date(today.getFullYear(), 11, 31),
          ],
          'Last month': [
            new Date(today.getFullYear(), today.getMonth() - 1, 1),
            new Date(today.getFullYear(), today.getMonth(), 0),
          ],
        }
      },
    },
  },
  data() {
    return {
      dateRange: {},
    }
  },
  mounted() {
    this.dateRange = this.value
  },
  computed: {
    textValue() {
      let text = ''
      if (!this.picker) {
        return ''
      }

      if (this.picker.startDate) {
        text = this.picker.startDate
      }

      if (this.picker.endDate) {
        text = `to ${this.picker.endDate}`
      }
      return text
    },
  },
  methods: {
    updateValues(e) {
      this.$emit('input', e)
      this.$emit('update', e)
    },
    checkOpen(e) {
      this.$emit('check-open', e)
    },
    clear() {
      this.dateRange = {}
      this.$emit('clear')
      this.$refs.picker.start = null
      this.$refs.picker.end = null
    },
    clickApplyCreate(cb) {
      cb()
      this.$emit('on-type', 'create')
    },
    clickApplyAccept(cb) {
      cb()
      this.$emit('on-type', 'accept')
    },
  },
  watch: {
    value: function(value) {
      this.dateRange = value
    },
  },
}
</script>
<style lang="scss">
.clear-date {
  position: relative;
  margin-top: 10px;
  margin-left: 3px;
  top: -1px;
}
.daterangepicker .drp-buttons .applyBtn {
  width: 120px;
}
</style>
