<template>
  <div class="pages" style="margin-top: 40px;">
    <div class="page-header bg-white" style="padding-top: 24px;">
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <div class="h-i">
            <span class="h-it">Mã lô hàng</span>
            <span class="h-iv">#{{ shipment.id }}</span>
          </div>
          <div class="h-i">
            <span class="h-it">Ngày tạo:</span>
            <span class="h-iv">{{
              shipment.created_at | datetime('dd/MM/yyyy HH:mm')
            }}</span>
          </div>
          <div class="h-i">
            <span class="h-it">Khối lượng:</span>
            <span class="h-iv">{{ shipment.weight | formatWeight }}kg</span>
          </div>
          <div class="h-i">
            <span class="h-it">Tổng giá:</span>
            <span class="h-iv">{{ total_amount | formatPrice }}</span>
          </div>
          <div class="h-i">
            <span class="h-it">Trạng thái:</span>
            <span class="h-iv">
              <Status :status="shipment.status" />
            </span>
          </div>
          <div class="h-i">
            <span class="h-it">Dịch vụ:</span>
            <span class="h-iv">{{ firstItem.service_name }}</span>
          </div>
        </div>
        <div class="head-actions">
          <p-button
            v-if="hasCreateTracking"
            @click.prevent="createTrackingConfirmHandle"
            class="btn-sm"
            >Vận lô</p-button
          >
          <p-button
            v-if="hasDownloadAllLabel"
            @click.prevent="handlerDownloadLabels"
            class="btn-sm"
            >Tải labels</p-button
          >
          <p-button
            v-if="hasCancel"
            @click.prevent="cancelConfirmHandle"
            class="btn-sm ml-3"
            type="default"
            >Hủy lô hàng</p-button
          >
        </div>
      </div>
    </div>
    <div class="page-content p-24">
      <div class="row">
        <div class="col-md-3">
          <div class="card-block">
            <div class="card-header">
              <div class="card-title">Người nhận</div>
            </div>
            <div class="card-content">
              <div class="ship-recipient">
                <p>
                  <span class="lb">Họ và tên:</span>
                  <span class="va">{{ firstItem.recipient }}</span>
                </p>
                <p>
                  <span class="lb">Điện thoại:</span>
                  <span class="va">{{ firstItem.phone_number }}</span>
                </p>
                <p>
                  <span class="lb">Địa chỉ:</span>
                  <span class="va">{{ firstItem.address_1 }}</span>
                </p>
                <p>
                  <span class="lb">Địa chỉ phụ:</span>
                  <span class="va">{{ firstItem.address_2 }}</span>
                </p>
                <p>
                  <span class="lb">Thành phố:</span>
                  <span class="va">{{ firstItem.city }}</span>
                </p>
                <p>
                  <span class="lb">Mã vùng:</span>
                  <span class="va">{{ firstItem.state }}</span>
                </p>
                <p>
                  <span class="lb">Mã bưu điện:</span>
                  <span class="va">{{ firstItem.zipcode }}</span>
                </p>
                <p>
                  <span class="lb">Mã quốc gia:</span>
                  <span class="va">{{ firstItem.country }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card-block">
            <div class="card-header">
              <div class="card-title">Chi tiết lô hàng</div>
            </div>
            <div class="card-content pt-0">
              <VclTable class="mt-20" v-if="isFetching"></VclTable>
              <template v-else-if="items.length">
                <div class="table-responsive">
                  <table class="table table-hover pt-0 tb-si">
                    <thead>
                      <tr>
                        <th>LionBay tracking</th>
                        <th>Mã đơn</th>
                        <th>Last mile tracking</th>
                        <th>Trọng lượng</th>
                        <th>LxWxH (cm)</th>
                        <th>Phí ship</th>
                        <th>Phí phát sinh</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in displayItems" :key="item.id">
                        <td>{{ item.code || 'N/A' }}</td>
                        <td class="order-number">
                          <div class="d-flex justify-content-between">
                            <router-link
                              class="text-no-underline"
                              :to="{
                                name: 'package-detail',
                                params: { id: item.id },
                              }"
                            >
                              {{ item.order_number }}
                            </router-link>
                          </div>
                        </td>
                        <td>{{ item.tracking_number || 'N/A' }}</td>
                        <td
                          >{{ item.weight | formatWeight }}kg
                          <span v-if="item.weight != item.actual_weight"
                            >({{ item.actual_weight | formatWeight }}kg)</span
                          ></td
                        >
                        <td
                          >{{ item.length }}x{{ item.width }}x{{ item.height }}
                          <span v-if="item.hasChangeVolume"
                            >({{ item.actual_length }}x{{
                              item.actual_width
                            }}x{{ item.actual_height }})</span
                          >
                        </td>
                        <td>{{ item.shipping_fee | formatPrice }}</td>
                        <td>{{ item.extra_fee | formatPrice }}</td>
                        <td><Status v-status="item.status_string"/></td>
                        <td class="text-right">
                          <a
                            v-if="item.label"
                            href="#"
                            class="label-print"
                            @click.prevent="downloadLabel(item)"
                          >
                            <p-tooltip
                              label="Print"
                              size="large"
                              position="top"
                              type="dark"
                            >
                              <inline-svg
                                :src="require('@assets/img/print.svg')"
                              >
                              </inline-svg>
                            </p-tooltip>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <empty-search-result v-else></empty-search-result>
            </div>
          </div>
          <div
            class="d-flex justify-content-between align-items-center mb-80"
            v-if="count > 0"
          >
            <p-pagination
              class="mt-0"
              :total="count"
              :per-page.sync="filter.limit"
              :current.sync="filter.page"
              size="sm"
            >
            </p-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  FETCH_DETAIL_SHIPMENTS,
  FETCH_LIST_SHIPMENT_ITEMS,
  FETCH_COUNT_SHIPMENT_ITEMS,
  FULFILL_SHIPMENT,
  CANCEL_SHIPMENT,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import Status from '../components/Status.vue'
import {
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_PENDING_PICKUP,
} from '../../package/constants'
import { print } from '@core/utils/print'
import { KG_TO_GRAM } from '@core/constants'
import JSZip from 'jszip'
import { extension } from '../../../core/utils/url'
import http from '../../../core/services/http'
import { saveAs } from 'file-saver'

export default {
  name: 'ShipmentDetail',
  mixins: [mixinRoute, mixinTable],
  components: { EmptySearchResult, Status },
  computed: {
    ...mapState('shipment', {
      shipment: (state) => state.shipment,
      total_amount: (state) => state.total_amount,
      items: (state) => state.items,
      count: (state) => state.items_count,
    }),
    id() {
      return parseInt(this.$route.params.id)
    },
    firstItem() {
      return this.items.length > 0 ? this.items[0] : {}
    },
    hasCreateTracking() {
      return (
        this.shipment.id > 0 && this.shipment.status === PACKAGE_STATUS_CREATED
      )
    },
    hasCancel() {
      return (
        this.shipment.id > 0 &&
        [PACKAGE_STATUS_CREATED, PACKAGE_STATUS_PENDING_PICKUP].includes(
          this.shipment.status
        )
      )
    },
    hasDownloadAllLabel() {
      return this.firstItem.label != ''
    },
    displayItems() {
      return this.items.map((item) => {
        const {
          length,
          width,
          height,
          actual_length,
          actual_width,
          actual_height,
        } = item
        const hasChangeVolume =
          length * width * height < actual_length * actual_width * actual_height

        return {
          ...item,
          hasChangeVolume,
        }
      })
    },
  },
  filters: {
    formatWeight(val) {
      return (val / KG_TO_GRAM).toFixed(2).replace('.00', '')
    },
  },
  data() {
    return {
      isFetching: false,
      isItemFetching: false,
      filter: {
        keyword: '',
        status: 0,
        page: 1,
      },
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.init()
  },
  methods: {
    ...mapActions('shipment', {
      fetchDetail: FETCH_DETAIL_SHIPMENTS,
      fetchListItems: FETCH_LIST_SHIPMENT_ITEMS,
      fetchCountItems: FETCH_COUNT_SHIPMENT_ITEMS,
      fulfillShipment: FULFILL_SHIPMENT,
      cancelShipment: CANCEL_SHIPMENT,
    }),

    async init() {
      this.isFetching = true
      this.fetchItems()
      const res = await this.fetchDetail(this.id)
      this.isFetching = false

      if (!res || res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    async fetchItems() {
      this.handleUpdateRouteQuery()

      const { id } = this
      const filters = { id, ...this.filter }

      this.isItemFetching = true

      this.fetchCountItems(filters)
      const res = await this.fetchListItems(filters)

      this.isItemFetching = false

      if (!res || res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    downloadLabel({ label }) {
      document.activeElement && document.activeElement.blur()
      try {
        print(label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },
    async handlerDownloadLabels() {
      const files = []

      for (const item of this.items) {
        if (item.label === '') {
          continue
        }

        const res = await http.get(
          `/uploads/file-export/download?type=labels&url=${item.label}`,
          { type: 'blob' }
        )
        if (!res && res.error) {
          this.$toast.error(res.errorMessage)
          continue
        }

        let ext = extension(item.label)
        ext = ext == 'pdf' ? ext : 'png'

        res['name'] = item.order_number + '_' + item.code + '.' + ext
        files.push(res)
      }

      var zip = new JSZip()
      Array.from(files).forEach((file) => {
        zip.file(file.name, file)
      })
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'label.zip')
      })
    },
    createTrackingConfirmHandle() {
      this.$dialog.confirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn vận lô?',
        confirmText: 'Vận lô',
        cancelText: 'Đóng',
        typeCancel: 'default',
        onConfirm: this.createTrackingHandle,
      })
    },
    async createTrackingHandle() {
      if (this.isFetching) return

      this.isFetching = true
      const { id } = this
      const res = await this.fulfillShipment(id)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success(
        'Đơn hàng đang được xử lý tạo tracking, thông tin xử lý sẽ được cập nhật sau'
      )
      this.init()
    },
    cancelConfirmHandle() {
      this.$dialog.confirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn hủy lô hàng?',
        confirmText: 'Xác nhận',
        cancelText: 'Đóng',
        typeCancel: 'default',
        onConfirm: this.cancelHandle,
      })
    },
    async cancelHandle() {
      if (this.isFetching) return

      this.isFetching = true
      const { id } = this
      const res = await this.cancelShipment(id)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Hủy lô hàng thành công')
      this.init()
    },
  },
  watch: {
    filter: {
      handler: function() {
        this.fetchItems()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.h-i {
  + .h-i {
    padding-left: 48px;
  }

  .h-it {
    display: block;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #525252;
    margin-bottom: 8px;
  }

  .h-iv {
    display: block;
    margin-top: -2px;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #161616;
  }
}

[class*='col-'] {
  .card-block {
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
  }
}

.ship-recipient {
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #525252;
  }

  .lb {
    width: 95px;
    display: inline-block;
  }
}

.tb-si {
  .btn {
    height: auto;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 5px;

    svg {
      padding: 0;
      margin: 0;
    }
  }
}

.page-header.bg-white {
  background-color: #fff;
}
.label-print {
  &:hover path {
    fill: #00978c;
  }
}
</style>
