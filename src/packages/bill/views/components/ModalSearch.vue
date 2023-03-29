<template>
  <div class="bill__search-advanced">
    <p-modal :active="visible" @close="handleClose" :title="`Xuất hóa đơn`">
      <template>
        <div class="search">
          <div class="d-flex mb-12 flex-column font-weight-600 ">
            <span> Khoảng thời gian:</span>
            <div class=" date-search  ">
              <p-datepicker
                ref="time"
                :format="'dd/mm/yyyy'"
                class="p-input-group input-group"
                @update="selectDate"
                :label="labelDate"
                id="date-search"
                :value="{
                  startDate: filter.start_date,
                  endDate: filter.end_date,
                }"
                :ranges="false"
                :date-format="dateFormat"
                @clear="clearSearchDate"
              ></p-datepicker>
            </div>
          </div>
        </div>
        <div class="status">
          <div class="title font-weight-600">Loại phí:</div>
          <div class="list-option">
            <div class="item checkbox-custom">
              <input
                type="checkbox"
                v-model="allSelected"
                @click="checkAll"
                id="all"
              />
              <label for="all">All</label>
              <div
                v-for="(item, i) in option"
                :key="i"
                class="item checkbox-custom"
              >
                <input
                  type="checkbox"
                  :id="item.name"
                  name="status"
                  :value="item.value"
                  v-model="filter.status_arr"
                />
                <label :for="item.name">{{ item.label }}</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="title font-weight-600">Loại hoá đơn:</div>
          <multiselect
            class="multiselect-custom dropdown-reason"
            :options="exportOptionType"
            placeholder="Chọn loại hóa đơn"
            :allow-empty="false"
            v-model="select"
            @select="handleSelectExportType"
            :custom-label="customLabel"
          ></multiselect>
        </div>
      </template>
      <template slot="footer">
        <div class="note">
          <b>Lưu ý: </b>
          <span
            >Kết quả tìm kiếm sẽ bao gồm các đơn ứng với tùy chọn và khoảng thời
            gian bạn lựa chọn.</span
          >
        </div>
        <div class="d-flex">
          <div class="ml-7">
            <p-button type="primary" @click="handleExport">
              {{ labelBtnDownload }}
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import { date } from '@core/utils/datetime'
import { EXPORT_GENERAL_TYPE, EXPORT_DETAIL_TYPE } from '../../constants'
export default {
  name: 'ModalSearch',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadingView: {
      type: Boolean,
      default: false,
    },
    loadingExport: {
      type: Boolean,
      default: false,
    },
    filterPage: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      filter: {
        status_arr: [],
        search: '',
        start_date: '',
        end_date: '',
        search_by: '',
      },
      export_type: '',
      select: null,
      disabledDates: new Date(Date.now() - 8640000),
      labelDate: `Chọn khoảng thời gian`,
      allSelected: false,
      err: false,
      option: [
        {
          name: 'package',
          value: 'package',
          label: 'Phí vận đơn',
        },
        {
          name: 'extra',
          value: 'extra',
          label: 'Phí phát sinh',
        },
      ],
      exportOptionType: [
        {
          name: 'Hóa đơn tổng quát',
          type: EXPORT_GENERAL_TYPE,
        },
        {
          name: 'Hóa đơn chi tiết',
          type: EXPORT_DETAIL_TYPE,
        },
      ],
    }
  },
  computed: {
    labelBtnDownload() {
      if (this.export_type === EXPORT_DETAIL_TYPE) {
        return 'Tải CSV'
      }
      return 'Xuất hóa đơn'
    },
  },
  created() {},

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.filter = {
        status_arr: [],
        search: '',
        start_date: '',
        end_date: '',
        search_by: '',
      }
      this.select = null
      this.export_type = ''
      this.clearSearchDate()
    },
    handleSelectExportType(select) {
      this.export_type = select.type
    },
    customLabel({ name }) {
      return name
    },
    dateFormat(classes, date) {
      if (!classes.disabled) {
        classes.disabled = date.getTime() > new Date(Date.now() - 25920000)
      }
      return classes
    },
    selectDate(v) {
      var year = new Date().getFullYear()
      var today = new Date().getTime()

      if (v.startDate !== null && v.endDate !== null) {
        const time = v.endDate.getTime() - v.startDate.getTime()
        const diff_days = Math.floor(time / (1000 * 3600 * 24))
        const range_days = Math.floor(
          (today - v.startDate.getTime()) / (1000 * 3600 * 24)
        )
        if (range_days > 90 || v.startDate.getFullYear() != year) {
          this.$toast.error(
            'Lịch sử tìm kiếm chỉ trong 3 tháng trước đến hiện tại ',
            { duration: 3000 }
          )
          this.$refs.time.clear()
          return
        }
        if (diff_days > 14) {
          this.$toast.error('Giới hạn tìm kiếm chỉ trong vòng 14 ngày', {
            duration: 3000,
          })
          this.$refs.time.clear()
          return
        }
      }
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
    },
    handleExport() {
      if (this.filter.start_date == '' || this.filter.end_date == '') {
        this.$toast.error('Chưa chọn khoảng thời gian', { duration: 3000 })
        return
      }
      if (
        this.filter.status_arr.length < 1 &&
        this.export_type != EXPORT_GENERAL_TYPE
      ) {
        this.$toast.error('Chưa chọn trạng thái', { duration: 3000 })
        return
      }
      if (this.export_type == '') {
        this.$toast.error('Chưa chọn loại hóa đơn export', { duration: 3000 })
        return
      }
      this.filter.export_type = this.export_type
      this.$emit('export', this.filter)
      this.filter = {
        status_arr: [],
        search: '',
        start_date: '',
        end_date: '',
        search_by: '',
      }
      this.export_type = ''
      this.select = null
      this.clearSearchDate()
    },
    checkAll() {
      this.filter.status_arr = []
      var checkboxes = document.getElementsByName('status')
      if (!this.allSelected) {
        for (var i = 0, n = checkboxes.length; i < n; i++) {
          this.filter.status_arr.push(checkboxes[i].value)
        }
      }
    },
    handleDeleteSearch() {
      this.filter.search = ''
    },
  },
  watch: {
    'filter.status_arr'() {
      this.allSelected =
        this.filter.status_arr.length == this.option.length ? true : false
    },
    visible: function() {
      this.err = false
    },
  },
}
</script>
