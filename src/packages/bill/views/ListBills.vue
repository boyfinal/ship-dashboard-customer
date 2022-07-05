<template>
  <div>
    <div class="page-content">
      <div class="page-body-bill">
        <div class="list__bills">
          <div class="page-header_action d-flex ">
            <div class="page-header_input ">
              <p-input
                placeholder="Tìm theo mã tracking hoặc mã hóa đơn"
                prefixIcon="search"
                class="mb-2"
                type="search"
                clearable
                :value.sync="filter.search"
                @keyup.enter="handleSearch"
              >
              </p-input>
            </div>
            <div class="page-header_date ml-7 d-flex">
              <p-datepicker
                :format="'dd/mm/yyyy'"
                class="p-input-group input-group"
                :label="labelDate"
                id="date-search"
                @update="selectDate"
                :singleDatePicker="false"
                @clear="clearDate"
                :value="{
                  startDate: filter.start_date,
                  endDate: filter.end_date,
                }"
              ></p-datepicker>

              <button
                class="btn-primary btn page-header_button ml-7"
                @click="onOpenModal"
              >
                <span>Xuất hóa đơn </span>
              </button>
            </div>
          </div>
          <div class="page-content">
            <vcl-table class="md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="bills.length">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="table-header">
                      <th style="width: 40%">MÃ HÓA ĐƠN </th>
                      <th style="width: 25%">NGÀY TẠO </th>
                      <th style="text-align: right">TỔNG TIỀN </th>
                      <th width="150" style="text-align: right"></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, i) in bills" :key="i">
                      <td>
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'bill-detail',
                            params: { code: item.code },
                          }"
                        >
                          {{ item.code }}
                        </router-link>
                      </td>

                      <td>{{ item.created_at | datetime('dd/MM/yyyy') }}</td>

                      <td
                        style="text-align: right"
                        v-if="total(item.shipping_fee, item.extra_fee) < 0"
                      >
                        -{{
                          Math.abs(total(item.shipping_fee, item.extra_fee))
                            | formatPrice
                        }}
                      </td>
                      <td style="text-align: right" v-else>
                        {{
                          total(item.shipping_fee, item.extra_fee) | formatPrice
                        }}
                      </td>
                      <td>
                        <p-tooltip
                          class="item_name"
                          :label="`Xuất hóa đơn`"
                          position="top"
                          type="dark"
                          v-if="handleStatus(item) != BillCreate"
                        >
                          <span class="download-bill">
                            <span @click="handleExport(item.code)">
                              <inline-svg
                                :src="
                                  require('../../../assets/img/export_bill.svg')
                                "
                              ></inline-svg>
                            </span>
                          </span> </p-tooltip
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
        <div
          class="paginate-bill d-flex justify-content-between align-items-center mt-24 mb-80"
          v-if="count > 0"
        >
          <p-pagination
            :total="count"
            :perPage.sync="filter.limit"
            :current.sync="filter.page"
            size="sm"
          ></p-pagination>
        </div>
      </div>
    </div>

    <ModalSearch
      :visible.sync="isVisibleModalSearch"
      :filterPage="filter"
      @export="handleExportBill"
    >
    </ModalSearch>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { date, dateFormat } from '@core/utils/datetime'
import { EXPORT_BILL, FETCH_BILL_LIST, EXPORT_BILLS } from '../store'
import { SET_LOADING } from '../../package/store'
import mixinDownload from '@/packages/shared/mixins/download'
import PTooltip from '../../../../uikit/components/tooltip/Tooltip'
import { BillCreate, BillPay, BillRefund } from '../constants'
import ModalSearch from './components/ModalSearch'
export default {
  name: 'ListBills',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: {
    PTooltip,
    EmptySearchResult,
    ModalSearch,
  },
  computed: {
    ...mapState('bill', {
      count: (state) => state.countBills,
      bills: (state) => state.bills,
    }),
  },
  data() {
    return {
      isLoading: false,
      filter: {
        limit: 25,
        start_date: '',
        end_date: '',
        search: '',
      },
      labelDate: `Tìm theo ngày`,
      isFetching: true,
      BillCreate: BillCreate,
      BillPay: BillPay,
      BillRefund: BillRefund,
      isVisibleModalSearch: false,
    }
  },

  created() {
    this.filter = this.getRouteQuery()
  },
  methods: {
    ...mapActions('bill', [FETCH_BILL_LIST, EXPORT_BILL, EXPORT_BILLS]),
    ...mapActions('package', [SET_LOADING]),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_BILL_LIST](this.filter)
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 4000,
        })
      }
      this.isFetching = false
    },
    total(ship, extra) {
      let total = ship + extra
      return total
    },

    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },

    clearDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
    },

    handleSearch(e) {
      this.filter.page = 1
      this.$set(this.filter, 'search', e.target.value.trim())
    },
    async handleExportBill(filter) {
      let params = {
        package: filter.status_arr.includes('package') ? 'true' : '',
        extra: filter.status_arr.includes('extra') ? 'true' : '',
        start_date: filter.start_date,
        end_date: filter.end_date,
      }
      // this.filter = { ...params }

      this[SET_LOADING](true)
      const result = await this[EXPORT_BILLS](params)
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this[SET_LOADING](false)
        this.isVisibleModalSearch = false
        return
      }
      this[SET_LOADING](false)
      this.downloadBill(result.url, 'bills', result.url.split('/')[1])
      this.isVisibleModalSearch = false
    },
    handleStatus(item) {
      let today = dateFormat(new Date())
      let itemDay = dateFormat(item.created_at)
      if (today == itemDay) {
        return BillCreate
      } else {
        if (this.total(item.shipping_fee, item.extra_fee) > 0) {
          return BillPay
        } else {
          return BillRefund
        }
      }
    },
    async handleExport(code) {
      this[SET_LOADING](true)
      const result = await this[EXPORT_BILL]({
        code: code,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this[SET_LOADING](false)
        return
      }
      this[SET_LOADING](false)
      this.downloadBill(result.url, 'bills', result.url.split('/')[1])
    },
    onOpenModal() {
      this.isVisibleModalSearch = true
    },
  },

  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.download-bill {
  // &:hover {
  //   span {
  //     background: #ddf2f2;
  //   }
  // }
  span {
    padding: 8px;
    // border-radius: 50%;
  }
}

.list__bills {
  .p-tooltip::after {
    width: 100px;
    text-align: center;
  }
}
</style>
