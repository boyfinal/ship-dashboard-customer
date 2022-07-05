<template>
  <div class="modal__search-advanced">
    <p-modal
      :active="visible"
      @close="handleClose"
      :title="`Tìm kiếm nâng cao`"
    >
      <template>
        <div class="search">
          <div class="d-flex mb-12">
            <p-input
              placeholder="Tìm kiếm theo bộ lọc"
              prefixIcon="search"
              type="search"
              v-model="filter.search"
              :clearable="true"
              @reset="handleDeleteSearch"
            >
            </p-input>
            <div class="d-flex date-search">
              <p-datepicker
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
                @clear="clearSearchDate"
              ></p-datepicker>
            </div>
          </div>
          <span
            >* Nếu không nhập từ khóa, hệ thống sẽ trả ra toàn bộ kết quả từ các
            điều kiện liên quan.</span
          >
        </div>
        <div class="options">
          <div class="title">Tùy chọn</div>
          <div class="row">
            <div class="col-4">
              <div class="item mb-8">
                <input
                  type="radio"
                  id="recipient"
                  value="recipient"
                  v-model="filter.search_by"
                />
                <label for="recipient">Người nhận</label>
              </div>
              <div class="item">
                <input
                  type="radio"
                  id="phone"
                  value="phone"
                  v-model="filter.search_by"
                />
                <label for="phone">SĐT người nhận</label>
              </div>
            </div>
            <div class="col-4">
              <div class="item mb-8">
                <input
                  type="radio"
                  id="state_code"
                  value="state_code"
                  v-model="filter.search_by"
                />
                <label for="state_code">Mã vùng</label>
              </div>
              <div class="item">
                <input
                  type="radio"
                  id="zipcode"
                  value="zipcode"
                  v-model="filter.search_by"
                />
                <label for="zipcode">Mã bưu điện</label>
              </div>
            </div>
            <div class="col-4">
              <div class="item mb-8">
                <input
                  type="radio"
                  id="order_number"
                  value="order_number"
                  v-model="filter.search_by"
                />
                <label for="order_number">Mã đơn hàng</label>
              </div>
              <div class="item">
                <input
                  type="radio"
                  id="sku"
                  value="sku"
                  v-model="filter.search_by"
                />
                <label for="sku">SKU</label>
              </div>
            </div>
          </div>
        </div>
        <div class="status">
          <div class="title">Trạng thái</div>
          <div class="row">
            <div class="item checkbox-custom">
              <input
                type="checkbox"
                v-model="allSelected"
                @click="checkAll"
                id="all"
              />
              <label for="all">All</label>
            </div>
            <div
              v-for="(item, i) in statusTab"
              :key="i"
              class="item checkbox-custom"
            >
              <input
                type="checkbox"
                :id="'status' + i"
                name="status"
                :value="item.value"
                v-model="filter.status_arr"
              />
              <label :for="'status' + i">{{ item.text }}</label>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="note">
          <b>Lưu ý: </b>
          <span
            >Kết quả tìm kiếm/xuất excel sẽ bao gồm các đơn ứng với tùy chọn và
            khoảng thời gian bạn lựa chọn.</span
          >
        </div>
        <div class="d-flex">
          <div>
            <p-button
              class="btn-lb-secondary"
              type="default"
              @click="handleView"
              :loading="loadingView"
              >Hiển thị</p-button
            >
          </div>
          <div class="ml-7">
            <p-button
              type="primary"
              @click="handleExport"
              :loading="loadingExport"
            >
              Tải excel
            </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import { date } from '@core/utils/datetime'
import { PACKAGE_STATUS_TAB } from '../../constants'
export default {
  name: 'ModalSearchAdvanced',
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
        page: 1,
        limit: 25,
      },
      labelDate: `Chọn ngày`,
      allSelected: false,
      err: false,
    }
  },
  computed: {
    statusTab() {
      return PACKAGE_STATUS_TAB.filter(
        (status) =>
          status.text != 'All' &&
          status.text != 'Alert' &&
          status.text != 'Archived'
      )
    },
  },
  created() {},

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    selectDate(v) {
      this.err = false
      if (v.startDate !== null && v.endDate !== null) {
        const time = v.endDate.getTime() - v.startDate.getTime()
        const diff_days = Math.floor(time / (1000 * 3600 * 24))
        if (diff_days > 29) {
          this.$toast.error('Giới hạn tìm kiếm chỉ trong vòng 30 ngày')
          this.err = true
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
    beforeAction() {
      if (this.err) return false
      if (this.filter.status_arr.length == 0) {
        this.$toast.error('Chưa chọn trạng thái')
        return false
      }
      if (this.filter.start_date == '' || this.filter.end_date == '') {
        this.$toast.error('Chưa chọn khoảng thời gian')
        return false
      }
      this.filter.search = this.filter.search.trim()
      return true
    },
    handleView() {
      if (!this.beforeAction()) return
      this.$emit('fetch', this.filter)
    },
    handleExport() {
      if (!this.beforeAction()) return
      this.$emit('export', this.filter)
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
    visible: function(val) {
      this.err = false
      if (val) {
        this.filter.start_date = this.filterPage.start_date
        this.filter.end_date = this.filterPage.end_date
      }
    },
    'filter.status_arr'() {
      this.allSelected =
        this.filter.status_arr.length == this.statusTab.length ? true : false
    },
  },
}
</script>
