<template>
  <div class="package-detail pages">
    <div v-if="!isEmpty" class="page-content">
      <div class="page-header">
        <div class="page-header__subtitle">
          <div
            class="page-header__info"
            :class="{ 'grip-5-col': !current.estimate_date_process }"
          >
            <div class="info-package">Mã vận đơn:</div>
            <div class="info-package">Dịch vụ </div>
            <div class="info-package">Last mile tracking </div>
            <div class="info-package">Ngày tạo </div>
            <div class="info-package" v-if="current.estimate_date_process"
              >Ngày xử lý dự kiến:
            </div>
            <div class="info-package">Trạng thái</div>
            <div class="package-code"
              >{{ current.code_package || 'N/A' }}
              <span
                @click="showContent"
                v-if="current.label"
                class="page-header__barcode"
              >
                <img
                  src="@/assets/img/Vector-barcode.png"
                  style="margin-top: 4px; position: absolute"
                />
              </span>
            </div>
            <div class="content-title">{{ current.service_name }}</div>
            <div class="content-title tracking" v-if="current">
              <track-link
                v-if="current.tracking_number"
                :current="current"
                :is-sm-screen="false"
              />
              <a v-else>N/A</a>
            </div>
            <div class="content-title">
              {{ current.created_at | datetime('dd/MM/yyyy - HH:mm:ss') }}
            </div>
            <div class="content-title" v-if="current.estimate_date_process">
              {{
                current.estimate_date_process
                  | datetime('dd/MM/yyyy - HH:mm:ss')
              }}
            </div>
            <div class="content-title">
              <span v-status:status="current.status_string"></span>
            </div>
          </div>
          <div class="page-header__action" v-if="!isFbaPkg">
            <p-button
              href="#"
              type="lb-default"
              @click="handleCancelPackage"
              v-if="hasCancelPackage"
            >
              Hủy đơn
            </p-button>
            <p-button
              @click="handleModal"
              class="ml-7"
              type="lb-default"
              v-if="hasEditPackage"
            >
              <span>Sửa đơn</span>
            </p-button>
            <p-button
              class="ml-7"
              @click="handleWayBill"
              type="primary"
              v-if="hasMakeTracking"
            >
              <span>Tạo tracking</span>
            </p-button>
            <a
              @click="handlerReturnPackage"
              class="btn btn-primary ml-7"
              v-if="hasReshipPackage"
            >
              Chuyển lại hàng
            </a>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-4 p-0">
                <div class="card-block">
                  <div class="card-header">
                    <div class="card-title">Người nhận</div>
                  </div>
                  <div class="card-content">
                    <div class="row">
                      <div class="col-3 mb-8">Họ và tên:</div>
                      <div class="col-9">{{ current.recipient }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Điện thoại:</div>
                      <div class="col-9">{{ current.phone_number }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Địa chỉ:</div>
                      <div class="col-9">{{ current.address_1 }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Địa chỉ phụ:</div>
                      <div class="col-9">{{ current.address_2 }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Thành phố:</div>
                      <div class="col-9">{{ current.city }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Mã vùng:</div>
                      <div class="col-9">{{ current.state_code }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3 mb-8">Mã bưu điện:</div>
                      <div class="col-9">{{ current.zipcode }}</div>
                    </div>
                    <div class="row">
                      <div class="col-3">Mã quốc gia:</div>
                      <div class="col-9">{{ current.country_code }}</div>
                    </div>
                  </div>
                </div>
                <div class="card-block card-tickets" style="margin-bottom:0">
                  <div class="card-header">
                    <div class="card-title">Trợ giúp & khiếu nại</div>
                  </div>
                  <div
                    class="card-content"
                    :class="{ 'middle-item': !claims.length }"
                  >
                    <template v-if="claims.length">
                      <div
                        class="tickets d-flex justify-content-between"
                        v-for="item in claims"
                        :key="item.id"
                      >
                        <router-link
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                          >{{ item.title }}</router-link
                        >
                        <time>{{
                          item.created_at | datetime('dd/MM/yyyy')
                        }}</time>
                      </div>
                      <div class="more-ticket" v-if="hasMoreTicket">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'claims',
                            query: { search: current.code_package },
                          }"
                          >Xem Thêm</router-link
                        >
                      </div>
                    </template>
                    <template v-else>
                      <div class="empty-info">
                        <inline-svg
                          :src="require('@assets/img/emty_info_icon.svg')"
                        ></inline-svg>
                        <div>Tuyệt vời. Đơn hàng không có khiếu nại.</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="col-4 p-0">
                <div class="card-block" id="item_info">
                  <div class="card-header">
                    <div class="card-title">Chi tiết đơn hàng</div>
                  </div>
                  <div class="card-content">
                    <div class="mb-18" v-if="current.is_package_exceed"
                      ><span class="pkg-exceed-bg pkg-exceed"
                        >Đơn hàng quá cỡ và sẽ được áp dụng cách tính giá
                        riêng</span
                      >
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Chi tiết sản phẩm:</div>
                      <div class="col-8">{{ current.detail }}</div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Mã đơn hàng:</div>
                      <div class="col-8">{{ current.order_number }}</div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Trọng lượng:</div>
                      <div
                        class="col-8"
                        :class="{ 'pkg-exceed': current.is_package_exceed }"
                      >
                        {{ current.weight }} gram
                        <span v-if="isOverWeight"
                          >({{ current.actual_weight }} gram)</span
                        >
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Dài:</div>
                      <div
                        class="col-8"
                        :class="{ 'pkg-exceed': current.is_package_exceed }"
                      >
                        {{ current.length }} cm
                        <span v-if="isOverVolumes"
                          >({{ current.actual_length }} cm)</span
                        >
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Rộng:</div>
                      <div
                        class="col-8"
                        :class="{ 'pkg-exceed': current.is_package_exceed }"
                      >
                        {{ current.width }} cm
                        <span v-if="isOverVolumes">
                          ({{ current.actual_width }} cm)
                        </span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 mb-8">Cao:</div>
                      <div
                        class="col-8"
                        :class="{ 'pkg-exceed': current.is_package_exceed }"
                      >
                        {{ current.height }} cm
                        <span v-if="isOverVolumes">
                          ({{ current.actual_height }} cm)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-block" style="margin-bottom:0">
                  <div class="card-header">
                    <div class="card-title">Thông tin sản phẩm</div>
                  </div>
                  <div
                    class="card-content"
                    :class="{ 'middle-item': !current.package_products.length }"
                  >
                    <template v-if="current.package_products.length">
                      <div class="row product-title">
                        <div class="col-5 mb-8">SKU</div>
                        <div class="col-5">Tên sản phẩm</div>
                        <div class="col-2 mb-8">Số lượng</div>
                      </div>
                      <div
                        class="row product-item"
                        v-for="(prod, index) in current.package_products"
                        :key="index"
                      >
                        <div class="col-5 mb-8">
                          <router-link
                            :to="{
                              name: 'list-product',
                              query: { search: prod.sku },
                            }"
                          >
                            {{ prod.sku }}
                          </router-link>
                        </div>
                        <div class="col-5">{{ prod.name }}</div>
                        <div class="col-2 mb-8 product-quantity">{{
                          prod.quantity
                        }}</div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="empty-info">
                        <inline-svg
                          :src="require('@assets/img/emty_info_icon.svg')"
                        ></inline-svg>
                        <div>Chưa có thông tin sản phẩm.</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="col-4 p-0" id="package-log">
                <div v-if="!displayDeliverDetail" class="col-12 p-0">
                  <div class="row">
                    <div class="col-12">
                      <div class="card-block">
                        <div class="card-header new">
                          <div class="card-title">Hành trình đơn</div>
                          <div class="card-action"
                            ><a @click.prevent="changeDisplayDeliverDetail()"
                              >Lịch sử đơn</a
                            >
                          </div>
                        </div>
                        <div
                          class="card-content log-content"
                          :class="{
                            'middle-item': !package_detail.deliver_logs,
                          }"
                        >
                          <DeliveryLog
                            :logs="package_detail.deliver_logs"
                            v-if="package_detail.deliver_logs"
                          />
                          <template v-else>
                            <div class="empty-info">
                              <inline-svg
                                :src="require('@assets/img/emty_info_icon.svg')"
                              ></inline-svg>
                              <div>Chưa có thông tin hành trình đơn.</div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="displayDeliverDetail" class="col-12 p-0">
                  <div class="row">
                    <div class="col-12">
                      <div class="card-block">
                        <div class="card-header new">
                          <div class="card-title">Lịch sử đơn</div>
                          <div class="card-action"
                            ><a @click.prevent="changeDisplayDeliverDetail()"
                              >Hành trình đơn</a
                            >
                          </div>
                        </div>
                        <div
                          class="card-content log-content"
                          :class="{
                            'middle-item': !package_detail.audit_logs.length,
                          }"
                        >
                          <AuditLog
                            :logs="package_detail.audit_logs"
                            v-if="package_detail.audit_logs.length"
                          />
                          <template v-else>
                            <div class="empty-info">
                              <inline-svg
                                :src="require('@assets/img/emty_info_icon.svg')"
                              ></inline-svg>
                              <div>Chưa có thông tin lịch sử đơn.</div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="fee">
              <div class="fee__left">
                <div class="title">Phí giao hàng:</div>
                <div class="title">Phí phát sinh:</div>
                <div class="title">Khuyến mãi:</div>
                <div class="title" :class="{ hidden_refund: !refundFee.length }"
                  >Phí hold:</div
                >
                <div class="fee__number">
                  {{ (current.shipping_fee || 0) | formatPrice }}
                </div>
                <div class="fee__number">
                  {{ sumExtraFee | formatPrice }}
                  <div
                    class="more-extra-fee"
                    v-if="
                      extraFees.length ||
                        (current.status_string == 'pending' &&
                          mapExtraFee.length)
                    "
                  >
                    <img
                      @mouseover="showPopupMoreExtraFee"
                      @mouseleave="hiddenPopupMoreExtraFee"
                      src="~@/assets/img/InfoCircleGrey.svg"
                    />
                  </div>
                </div>
                <div
                  v-if="isVisiblePopupMoreExtraFee"
                  class="pop-up-more-extra-fee"
                >
                  <div v-for="(item, i) of mapExtraFee" :key="i">
                    <div>{{ item.extra_fee_types.name }}</div>
                    <div>{{ item.amount | formatPrice }}</div>
                  </div>
                </div>

                <div class="fee__number">
                  {{ discount | formatPrice }}
                  <p-tooltip
                    :label="'Khuyến mãi theo cân nặng'"
                    size="large"
                    position="top"
                    type="dark"
                  >
                    <img src="~@/assets/img/InfoCircleGrey.svg" />
                  </p-tooltip>
                </div>

                <div v-if="refundFee.length > 0" class="fee__number"
                  >{{ sumRefundFee | formatPrice }}
                  <div class="more-extra-fee">
                    <img
                      @mouseover="showPopupMoreRefundFee"
                      @mouseleave="hiddenPopupMoreRefundFee"
                      src="~@/assets/img/InfoCircleGrey.svg"
                      alt=""
                    />
                  </div>
                </div>

                <div
                  v-if="isVisiblePopupMoreRefundFee"
                  class="pop-up-more-refund-fee"
                >
                  <div class="">Ngày xử lý dự kiến</div>
                  <div
                    v-for="(item, i) of package_detail.package_refund"
                    :key="i"
                  >
                    <div class="amount">{{ item.amount | formatPrice }} : </div>
                    <div>{{ item.created_at | datetime('dd/MM/yyyy') }} </div>
                  </div>
                </div>
              </div>
              <div class="fee__right">
                <div> Tổng cước: </div>
                <div>{{ sumFee | formatPrice }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NotFound v-else></NotFound>

    <modal-edit-order :visible.sync="isVisibleModal" @create="init">
    </modal-edit-order>
    <modal-confirm
      :visible.sync="isVisibleConfirmWayBill"
      v-if="isVisibleConfirmWayBill"
      :actionConfirm="actions.wayBill.button"
      :description="actions.wayBill.Description"
      :title="actions.wayBill.title"
      :type="actions.wayBill.type"
      :disabled="actions.wayBill.disabled"
      :loading="actions.wayBill.loading"
      @action="handleActionWayBill"
    ></modal-confirm>

    <modal-confirm
      :visible.sync="visibleConfirmCancel"
      v-if="visibleConfirmCancel"
      :actionConfirm="actions.cancelPackage.button"
      :cancel="actions.cancelPackage.cancel"
      :description="actions.cancelPackage.Description"
      :title="actions.cancelPackage.title"
      :type="actions.cancelPackage.type"
      :disabled="actions.cancelPackage.disabled"
      :loading="actions.cancelPackage.loading"
      @action="cancelPackageAction"
    ></modal-confirm>
    <modal-confirm
      :visible.sync="visibleConfirmReturn"
      v-if="visibleConfirmReturn"
      :actionConfirm="actions.returnPackage.button"
      :cancel="actions.returnPackage.cancel"
      :description="actions.returnPackage.Description"
      :title="actions.returnPackage.title"
      :type="actions.returnPackage.type"
      :disabled="actions.returnPackage.disabled"
      :loading="actions.returnPackage.loading"
      @action="pendingPickupPackageAction"
    ></modal-confirm>
  </div>
</template>

<style scoped>
.sum-price {
  border-top: 1px solid #cfd0d0;
  margin-top: 16px;
  padding-top: 16px;
}

.sum-price:last-child {
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  color: #313232;
}

.disable-extra-fee {
  color: #cfd0d0;
}

#package-log {
  padding: 0 12px;
}
</style>
<script>
import { mapState, mapActions } from 'vuex'
import { print } from '@core/utils/print'
import {
  FETCH_PACKAGE_DETAIL,
  FETCH_LIST_SERVICE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
  PENDING_PICKUP_PACKAGES,
} from '../store/index'
import {
  PACKAGE_STATUS_CREATED_TEXT,
  EXTRA_FEE_TYPE_DISCOUNT,
} from '../constants'
import ModalEditOrder from './components/ModalEditOrder'
import NotFound from '@/components/shared/NotFound'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import mixinTable from '@core/mixins/table'
import mixinPackageDetail from '../mixins/package_detail'
import AuditLog from './components/AuditLog'
import DeliveryLog from './components/DeliveryLog'
import { FETCH_TICKETS, COUNT_TICKET } from '../../claim/store'
import { cloneDeep } from '../../../core/utils'
import TrackLink from './components/Track.vue'
import { FBA_SERVICE_CODE } from '../constants'
export default {
  name: 'PackageDetail',
  mixins: [mixinPackageDetail, mixinTable],
  components: {
    ModalEditOrder,
    ModalConfirm,
    NotFound,
    AuditLog,
    DeliveryLog,
    TrackLink,
  },
  data() {
    return {
      isFetching: true,
      displayDeliverDetail: false,
      isVisibleModal: false,
      isVisiblePopupMoreExtraFee: false,
      isVisiblePopupMoreRefundFee: false,
      isVisibleConfirmWayBill: false,
      actions: {
        wayBill: {
          type: 'primary',
          title: 'Xác nhận',
          button: 'Tạo tracking',
          Description: '',
          disabled: false,
          loading: false,
        },
        cancelPackage: {
          type: 'primary',
          title: 'Xác nhận hủy đơn',
          button: 'Hủy đơn',
          cancel: 'Bỏ qua',
          Description: '',
          disabled: false,
          loading: false,
        },
        returnPackage: {
          type: 'primary',
          title: 'Xác nhận chuyển lại hàng',
          button: 'Xác nhận',
          cancel: 'Bỏ qua',
          Description: '',
          disabled: false,
          loading: false,
        },
      },
      isSubmitting: false,
      visibleConfirmCancel: false,
      isVisibleModalLabel: false,
      visibleConfirmReturn: false,
      blob: null,
      ticketLimit: 5,
    }
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
    }),
    ...mapState('claim', {
      claims: (state) => state.claims,
      totalTicket: (state) => state.count,
    }),
    current() {
      return this.package_detail.package || {}
    },
    sumRefundFee() {
      return this.refundFee.reduce((total, { amount }) => total + amount, 0)
    },
    isPkgExceedNotEstimate() {
      return this.current.is_package_exceed && this.current.shipping_fee == 0
    },
    isFbaPkg() {
      return this.current.service_code === FBA_SERVICE_CODE
    },
    sumExtraFee() {
      let amount = 0
      if (
        this.current.status_string == PACKAGE_STATUS_CREATED_TEXT &&
        !this.isPkgExceedNotEstimate
      ) {
        amount += this.calculateFee(this.current.weight)
      }

      amount += this.extraFees.reduce((total, v) => total + v.amount, 0)
      return amount
    },
    sumFee() {
      return this.current.shipping_fee + this.sumExtraFee + this.discount
    },
    discount() {
      const total = this.extraFeeDiscount.reduce(
        (total, { amount }) => total + amount,
        0
      )
      return total
    },
    extraFees() {
      return (this.package_detail.extra_fee || []).filter(
        ({ extra_fee_type_id }) => extra_fee_type_id != EXTRA_FEE_TYPE_DISCOUNT
      )
    },
    extraFeeDiscount() {
      return (this.package_detail.extra_fee || []).filter(
        ({ extra_fee_type_id }) => extra_fee_type_id == EXTRA_FEE_TYPE_DISCOUNT
      )
    },
    refundFee() {
      return this.package_detail.package_refund || []
    },
    mapExtraFee() {
      const result = []
      if (
        this.current.status_string == PACKAGE_STATUS_CREATED_TEXT &&
        !this.isPkgExceedNotEstimate
      ) {
        if (this.calculateFee(this.current.weight) > 0) {
          result.push({
            extra_fee_types: { name: 'Peak season surcharge' },
            amount: this.calculateFee(this.current.weight),
          })
        }
      }
      for (const ele of this.extraFees) {
        let index = result.findIndex(
          (x) => x.extra_fee_types.name == ele.extra_fee_types.name
        )

        if (index === -1) {
          result.push(cloneDeep(ele))
        } else {
          result[index].amount += ele.amount
        }
      }

      return result
    },
    packageID() {
      return parseInt(this.$route.params.id, 10)
    },
    isOverWeight() {
      const { actual_weight, weight } = this.current
      return actual_weight > weight
    },
    isOverVolumes() {
      const {
        actual_height,
        actual_width,
        actual_length,
        height,
        width,
        length,
      } = this.current
      return (
        actual_height * actual_width * actual_length > height * width * length
      )
    },
    hasMoreTicket() {
      return this.totalTicket > this.ticketLimit
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('package', [
      FETCH_PACKAGE_DETAIL,
      FETCH_LIST_SERVICE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
      PENDING_PICKUP_PACKAGES,
    ]),
    ...mapActions('claim', [FETCH_TICKETS, COUNT_TICKET]),

    async init() {
      this.isFetching = true

      await Promise.all([
        this.fetchPackage(this.packageID),
        this.fetchListService(),
        this[FETCH_TICKETS]({
          package_id: this.packageID,
          limit: this.ticketLimit,
        }),
        this[COUNT_TICKET]({
          package_id: this.packageID,
          limit: this.ticketLimit,
        }),
      ])

      this.isFetching = false
    },

    changeDisplayDeliverDetail() {
      this.displayDeliverDetail = !this.displayDeliverDetail
    },
    handleModal() {
      this.isVisibleModal = true
    },
    showPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = true
    },
    hiddenPopupMoreExtraFee() {
      this.isVisiblePopupMoreExtraFee = false
    },

    showPopupMoreRefundFee() {
      this.isVisiblePopupMoreRefundFee = true
    },
    hiddenPopupMoreRefundFee() {
      this.isVisiblePopupMoreRefundFee = false
    },

    handleWayBill() {
      this.actions.wayBill.Description = `Bạn có chắc chắn muốn tạo tracking?`
      this.isVisibleConfirmWayBill = true
    },
    async handleActionWayBill() {
      let params = { ids: [this.packageID] }

      this.actions.wayBill.loading = true
      const res = await this.processPackage(params)
      this.isVisibleConfirmWayBill = false
      this.actions.wayBill.loading = false

      if (!res || !res.success) {
        this.$toast.error(res.message, { duration: 3000 })
        return
      }

      this.init()
      let msg = 'Tạo tracking thành công'
      if (res.promotion_label) {
        msg =
          'Đơn hàng đang được xử lý tạo tracking, thông tin xử lý sẽ được cập nhật sau'
      }
      this.$toast.success(msg, { duration: 3000 })
    },

    handleCancelPackage() {
      this.actions.cancelPackage.Description = `Bạn có chắc chắn muốn hủy đơn?`
      this.visibleConfirmCancel = true
    },

    async cancelPackageAction() {
      let payload = { ids: [this.packageID] }

      this.actions.cancelPackage.loading = true
      const result = await this[CANCEL_PACKAGES](payload)
      this.visibleConfirmCancel = false
      this.actions.cancelPackage.loading = false

      if (!result || !result.success) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.init()
      this.$toast.success('Hủy đơn thành công', { duration: 3000 })
    },

    handlerReturnPackage() {
      this.actions.returnPackage.Description = `Bạn có chắc chắn muốn chuyển lại hàng ?`
      this.visibleConfirmReturn = true
    },

    async pendingPickupPackageAction() {
      const payload = { ids: [this.packageID] }

      this.actions.returnPackage.loading = true
      const result = await this[PENDING_PICKUP_PACKAGES](payload)
      this.visibleConfirmReturn = false
      this.actions.returnPackage.loading = false

      if (!result || !result.success) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.init()
      this.$toast.success('Chuyển lại hàng thành công', { duration: 3000 })
    },

    async showContent() {
      document.activeElement && document.activeElement.blur()
      try {
        print(this.current.label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
  },
}
</script>
