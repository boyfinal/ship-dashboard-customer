<template>
  <div class="wallet pages">
    <div v-if="!isEmpty" class="page-content">
      <div class="page-header">
        <div class="page-header__title ">Chi tiết hóa đơn</div>
      </div>
      <div class="page-body">
        <div class=" list__bill">
          <div class="container p-0">
            <vcl-table class=" md-20" v-if="isFetching"></vcl-table>
            <template v-else-if="bill">
              <div class="page-content">
                <div v-if="bill" class="header_info d-flex mb-16 ">
                  <div class="header_info-content">
                    <div class="info-bill">Mã hóa đơn : </div>
                    <div class="info-bill">Ngày tạo: </div>
                    <div class="info-bill">Tổng hóa đơn : </div>
                    <span class="info-number">{{ bill.code }}</span>
                    <span class="info-number">{{
                      bill.created_at | datetime('dd/MM/yyyy HH:mm:ss ')
                    }}</span>
                    <span class="info-number total-price font-weight-600">
                      {{ billAmount | formatPrice }}
                    </span>
                  </div>
                  <button
                    @click="handleExport"
                    :disabled="isVisibleExport"
                    class="btn-primary btn "
                    v-if="handleStatus(bill) != BillCreate && !isEmptyBill"
                  >
                    <img src="~@/assets/img/arrow-down.svg" />
                    <span>Xuất hóa đơn </span>
                  </button>
                </div>
                <div class="card-block" v-if="feeCreate.length">
                  <div class="card-content">
                    <div class="card-title">
                      <div class="title-text">Phí vận đơn</div>
                      <PrevNext
                        :current.sync="filter.page"
                        :total="countCreate"
                        :per-page="filter.limit"
                      />
                    </div>
                    <vcl-table
                      class="md-20"
                      v-if="isFetchingPackages"
                    ></vcl-table>
                    <div class="table-responsive" v-else>
                      <table class="table table-hover">
                        <thead>
                          <tr class="table-header">
                            <th width="270">LIONBAY TRACKING</th>
                            <th width="270">THỜI GIAN </th>
                            <th>LAST MILE TRACKING</th>
                            <th class="text-right">PHÍ VẬN ĐƠN </th>
                          </tr>
                        </thead>

                        <tbody v-if="bill">
                          <tr v-for="(item, i) in feeCreate" :key="i">
                            <td>
                              <router-link
                                class="text-no-underline"
                                :to="{
                                  name: 'package-detail',
                                  params: {
                                    id: item.id,
                                  },
                                }"
                              >
                                {{ item.code }}
                                <img src="@/assets/img/external.svg" />
                              </router-link>
                            </td>
                            <td>{{
                              item.created_at | datetime('dd/MM/yyyy HH:mm:ss')
                            }}</td>
                            <td>{{ item.tracking_number }}</td>
                            <td class="text-right">{{
                              item.shipping_fee | formatPrice2
                            }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="card-block  " v-if="feeExtra.length">
                  <div class="card-content">
                    <div class="card-title">
                      <div class="title-text"> Phí phát sinh </div>
                      <PrevNext
                        :current.sync="filterExtra.page"
                        :total="countExtra"
                        :per-page="filterExtra.limit"
                      />
                    </div>
                    <vcl-table class="md-20" v-if="isFetchingFees"></vcl-table>
                    <div class="table-responsive" v-else>
                      <table class="table table-hover">
                        <thead>
                          <tr class="table-header">
                            <th width="270">LIONBAY TRACKING</th>
                            <th width="100">MÃ LÔ FBA</th>
                            <th width="190">THỜI GIAN </th>
                            <th>LOẠI PHÍ</th>
                            <th>NỘI DUNG</th>
                            <th class="text-right">PHÍ PHÁT SINH</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr v-for="(item, i) in feeExtra" :key="i">
                            <td>
                              <router-link
                                v-if="item.package_id"
                                class="text-no-underline"
                                :to="{
                                  name: 'package-detail',
                                  params: {
                                    id: item.package_id,
                                  },
                                }"
                              >
                                {{ item.package_code }}
                                <img src="@/assets/img/external.svg" />
                              </router-link>
                            </td>
                            <td>
                              <router-link
                                v-if="item.shipment_id"
                                class="text-no-underline"
                                :to="{
                                  name: 'shipment-detail',
                                  params: {
                                    id: item.shipment_id,
                                  },
                                }"
                              >
                                #{{ item.shipment_id }}
                              </router-link>
                            </td>
                            <td>{{
                              item.created_at | datetime('dd/MM/yyyy HH:mm:ss')
                            }}</td>
                            <td>{{ item.type_name }}</td>
                            <td>
                              <p-tooltip
                                :label="item.description"
                                size="large"
                                position="top"
                                type="dark"
                                :active="item.description.length > 15"
                              >
                                {{ truncate(item.description, 15) }}
                              </p-tooltip>
                            </td>
                            <td class="text-right">{{
                              item.amount | formatPrice2
                            }}</td>
                            <td class="text-right" v-if="item.status == 10">
                              <span class="badge badge-round badge-unpaid"
                                >Chưa thanh toán</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="card-block" v-if="feeRefund.length">
                  <div class="card-content">
                    <div class="card-title">
                      <div class="title-text"> Hoàn tiền </div>
                      <PrevNext
                        :current.sync="filterRefund.page"
                        :total="countRefund"
                        :per-page="filterRefund.limit"
                      />
                    </div>
                    <vcl-table
                      class="md-20"
                      v-if="isFetchingRefund"
                    ></vcl-table>
                    <div class="table-responsive" v-else>
                      <table class="table table-hover">
                        <thead>
                          <tr class="table-header">
                            <th width="270">LIONBAY TRACKING </th>
                            <th width="270">THỜI GIAN </th>
                            <th>NỘI DUNG</th>
                            <th class="text-right">PHÍ HOÀN TIỀN </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr v-for="(item, i) in feeRefund" :key="i">
                            <td>
                              <router-link
                                v-if="item.package_code"
                                class="text-no-underline"
                                :to="{
                                  name: 'package-detail',
                                  params: {
                                    id: item.package_id,
                                  },
                                }"
                              >
                                {{ item.package_code }}
                                <img src="@/assets/img/external.svg" />
                              </router-link>
                            </td>
                            <td>{{
                              item.created_at | datetime('dd/MM/yyyy HH:mm:ss')
                            }}</td>
                            <td v-if="item.status == 10">
                              <span class="badge badge-round badge-unpaid"
                                >Chưa thanh toán</span
                              >
                            </td>
                            <td>
                              <p-tooltip
                                :label="item.description"
                                size="large"
                                position="top"
                                type="dark"
                                :active="item.description.length > 15"
                              >
                                {{ truncate(item.description, 15) }}
                              </p-tooltip>
                            </td>
                            <td class="text-right">{{
                              item.amount | formatPrice2
                            }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
      </div>
    </div>
    <NotFound v-else></NotFound>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  FETCH_BILL_DETAIL,
  FETCH_BILL_EXTRA,
  FETCH_BILL_REFUND,
  FETCH_PACKAGES,
  EXPORT_BILL,
} from '../store'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import { truncate } from '@core/utils/string'
import PrevNext from '../components/PrevNext'
import { debounce } from '@core/utils'
import NotFound from '../../../components/shared/NotFound'
import mixinDownload from '@/packages/shared/mixins/download'
import _ from 'lodash'
import { dateFormat } from '@core/utils/datetime'
import { BillCreate, BillRefund, BillPay, EXTRA_FEE_REFUND } from '../constants'

export default {
  name: 'BillDetail',
  mixins: [mixinTable, mixinDownload],
  components: { EmptySearchResult, PrevNext, NotFound },
  data() {
    return {
      filter: {
        limit: 5,
        page: 1,
      },
      orderPagination: {
        numberPage: 0,
        itemsPerPage: 10,
        currentPage: 1,
      },
      filterExtra: {
        limit: 5,
        page: 1,
      },
      filterRefund: {
        limit: 5,
        page: 1,
        type: EXTRA_FEE_REFUND,
      },
      isFetching: false,
      isFetchingPackages: false,
      isFetchingFees: false,
      isFetchingRefund: false,
      isVisibleExport: false,
      BillCreate: BillCreate,
      BillRefund: BillRefund,
      BillPay: BillPay,
    }
  },
  computed: {
    ...mapState('bill', {
      bill: (state) => state.bill,
      feeCreate: (state) => state.feeCreate,
      countCreate: (state) => state.countCreate,
      feeExtra: (state) => state.feeExtra,
      countExtra: (state) => state.countExtra,
      feeRefund: (state) => state.feeRefund,
      countRefund: (state) => state.countRefund,
    }),
    extraFee() {
      const extra = this.feeExtra.filter(
        (item) => item.extra_fee_type_id != EXTRA_FEE_REFUND
      )
      return extra
    },
    billAmount() {
      return this.bill.extra_fee + this.bill.shipping_fee
    },
    billCode() {
      const { code } = this.$route.params
      return code
    },
    isEmpty() {
      /*Check bill không tồn tại */
      const temp = _.isEmpty(this.bill)
      return temp
    },
    isEmptyBill() {
      /*Check bill rỗng */
      return (
        !this.feeCreate.length &&
        !this.feeRefund.length &&
        !this.feeExtra.length
      )
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    truncate,
    ...mapActions('bill', [
      FETCH_BILL_DETAIL,
      FETCH_BILL_EXTRA,
      FETCH_BILL_REFUND,
      FETCH_PACKAGES,
      EXPORT_BILL,
    ]),

    async init() {
      this.isFetching = true
      const { code } = this.$route.params
      let res = await this[FETCH_BILL_DETAIL]({ code })
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message, { duration: 4000 })
        return
      }
      const filter = Object.assign({ code }, this.filter)
      const filterExtra = Object.assign({ code }, this.filterExtra)
      const filterRefund = Object.assign({ code }, this.filterRefund)

      await Promise.all([
        this[FETCH_PACKAGES](filter),
        this[FETCH_BILL_EXTRA](filterExtra),
        this[FETCH_BILL_REFUND](filterRefund),
      ])
    },
    async handleExport() {
      const { code } = this.$route.params
      this.isVisibleExport = true
      const result = await this[EXPORT_BILL]({
        code: code,
      })
      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        this.isVisibleExport = false
        return
      }
      this.downloadBill(result.url, 'bills', result.url.split('/')[1])
      this.isVisibleExport = false
    },
    fetchPackagesHandle: debounce(async function() {
      this.isFetchingPackages = true
      const filter = Object.assign({ code: this.billCode }, this.filter)
      await this[FETCH_PACKAGES](filter)
      this.isFetchingPackages = false
    }, 200),

    fetchFeesHandle: debounce(async function() {
      this.isFetchingFees = true
      const filter = Object.assign({ code: this.billCode }, this.filterExtra)
      await this[FETCH_BILL_EXTRA](filter)
      this.isFetchingFees = false
    }, 200),

    fetchRefundHandle: debounce(async function() {
      this.isFetchingRefund = true
      const filter = Object.assign({ code: this.billCode }, this.filterRefund)
      await this[FETCH_BILL_REFUND](filter)
      this.isFetchingRefund = false
    }, 200),
    handleStatus(item) {
      let today = dateFormat(new Date())
      let itemDay = dateFormat(item.created_at)
      if (today == itemDay) {
        return BillCreate
      } else {
        if (this.billAmount > 0) {
          return BillPay
        } else {
          return BillRefund
        }
      }
    },
  },
  watch: {
    'filter.page': function() {
      this.fetchPackagesHandle()
    },
    'filterExtra.page': function() {
      this.fetchFeesHandle()
    },
    'filterRefund.page': function() {
      this.fetchRefundHandle()
    },
  },
}
</script>
<style lang="scss" scoped>
.disable-next-page {
  background-color: #f6f7f7;
  pointer-events: none;
}
.p-tooltip:after {
  height: auto;
  word-break: break-word;
  // width: 250%;
  text-align: center;
}
</style>
