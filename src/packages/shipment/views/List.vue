<template>
  <div class="pages list-cus-shipment">
    <div class="page-header">
      <div class="action-header d-flex justify-content-between">
        <div class="page-header__input mr-30" style="flex: 1;">
          <p-input
            placeholder="Tìm theo mã lô hàng, mã đơn hàng, mã tracking"
            prefixIcon="search"
            type="search"
            :value="filter.keyword"
            @keyup.enter="handleSearch"
            :clearable="true"
            @reset="handleClearSearch"
          >
          </p-input>
        </div>
        <div class="d-flex date-search">
          <p-datepicker
            :format="'dd/mm/yyyy'"
            class="p-input-group input-group"
            @update="selectDate"
            label="Tìm theo ngày"
            id="date-search"
            :value="{
              startDate: filter.start_date,
              endDate: filter.end_date,
            }"
            @clear="clearSearchDate"
          ></p-datepicker>
        </div>
        <div class="d-flex">
          <div class="btn-action">
            <button
              class="pull-right btn-primary btn ml-2"
              @click="handleImport"
            >
              <inline-svg
                :src="require('../../../assets/img/uploadex.svg')"
              ></inline-svg>
              <span>Nhập Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <StatusTab v-model="filter.status" />
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="shipments.length">
              <div class="table-responsive">
                <table class="table table-hover tb-si">
                  <thead>
                    <tr>
                      <th>SHIPMENT NO.</th>
                      <th>WEIGHT</th>
                      <th>CREATED DATE</th>
                      <th>STATUS</th>
                      <th class="text-right">TOTAL FEE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in displayShipments" :key="item.id">
                      <td class="order-number">
                        <div class="d-flex justify-content-between">
                          <router-link
                            class="text-no-underline"
                            :to="{
                              name: 'shipment-detail',
                              params: { id: item.id },
                            }"
                          >
                            {{ item.id }}
                          </router-link>
                        </div>
                      </td>
                      <td>{{ item.weight }}kg</td>
                      <td>{{
                        item.created_at | datetime('dd/MM/yyyy HH:mm')
                      }}</td>
                      <td>
                        <Status :status="item.status" />
                      </td>
                      <td class="text-right">{{ item.price | formatPrice }}</td>
                      <td class="text-right">
                        <p-button
                          v-if="item.hasCreateTracking"
                          @click.prevent="createTrackingConfirmHandle(item)"
                          class="btn-sm"
                          >Vận lô</p-button
                        >
                        <p-button
                          v-if="item.hasCancel"
                          @click.prevent="cancelConfirmHandle(item)"
                          class="btn-sm ml-3"
                          type="danger"
                          >Hủy</p-button
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mb-80"
                v-if="count > 0"
              >
                <p-pagination
                  :total="count"
                  :per-page.sync="filter.limit"
                  :current.sync="filter.page"
                  size="sm"
                >
                </p-pagination>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
      </div>
    </div>
    <modal-import-preview-package
      :visible.sync="isVisiblePreview"
      :import-errors="resultImport.errors"
      :import-sucess="resultImport.import_sucess"
      :total="resultImport.total"
      v-if="isVisiblePreview"
      @close="handleClosePreview"
    >
    </modal-import-preview-package>
    <modal-import
      :visible.sync="isVisibleImport"
      :uploading="isUploading"
      accept=".csv"
      title="Nhập Excel"
      @selected="handleImportPackage"
      v-if="isVisibleImport"
    >
    </modal-import>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  FETCH_LIST_SHIPMENTS,
  FETCH_COUNT_SHIPMENTS,
  IMPORT_PACKAGE_FBA,
  FULFILL_SHIPMENT,
  CANCEL_SHIPMENT,
} from '../store'
import {
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_PENDING_PICKUP,
} from '../../package/constants'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import ModalImportPreviewPackage from '../components/ModalImportPreviewPackage'
import ModalImport from '@components/shared/modal/ModalImport'
import Status from '../components/Status.vue'
import StatusTab from '../components/StatusTab.vue'
import { date } from '@core/utils/datetime'
import { KG_TO_GRAM } from '@core/constants'

export default {
  name: 'ShipmentList',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalImportPreviewPackage,
    ModalImport,
    Status,
    StatusTab,
  },
  computed: {
    ...mapState('shipment', {
      shipments: (state) => state.shipments,
      count: (state) => state.count,
    }),
    displayShipments() {
      return this.shipments.map((item) => {
        const weight = (item.weight / KG_TO_GRAM).toFixed(2).replace('.00', '')
        return {
          ...item,
          weight,
          hasCreateTracking: item.status === PACKAGE_STATUS_CREATED,
          hasCancel: [
            PACKAGE_STATUS_CREATED,
            PACKAGE_STATUS_PENDING_PICKUP,
          ].includes(item.status),
        }
      })
    },
  },
  data() {
    return {
      isFetching: false,
      isVisiblePreview: false,
      isVisibleImport: false,
      isUploading: false,
      importData: {
        file: null,
      },
      resultImport: {},
      filter: {
        keyword: '',
        status: '',
        page: 1,
        start_date: '',
        end_date: '',
      },
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  methods: {
    ...mapActions('shipment', {
      fetchListShipment: FETCH_LIST_SHIPMENTS,
      fetchCountShipment: FETCH_COUNT_SHIPMENTS,
      importPackageFba: IMPORT_PACKAGE_FBA,
      fulfillShipment: FULFILL_SHIPMENT,
      cancelShipment: CANCEL_SHIPMENT,
    }),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      const filters = { ...this.filter }

      this.fetchCountShipment(filters)
      const res = await this.fetchListShipment(filters)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },
    handleSearch(e) {
      this.filter.keyword = e.target.value.trim()
    },
    handleClearSearch() {
      this.filter.keyword = ''
      this.filter.page = 1
    },
    handleClosePreview() {
      this.filter = {
        keyword: '',
        status: 0,
        page: 1,
      }
      this.init()
    },
    async handleImportPackage(file, template) {
      this.importData.file = file
      this.isUploading = true
      this.resultImport = await this.importPackageFba({
        file: this.importData.file.raw,
        template_id: template.id,
      })
      this.isUploading = false
      this.isVisibleImport = false

      if (this.resultImport && this.resultImport.success) {
        this.isVisiblePreview = true
        return
      }

      this.$toast.open({
        type: 'error',
        message: this.resultImport.message || 'File không đúng định dạng',
      })
    },
    handleImport() {
      this.isVisibleImport = true
    },
    createTrackingConfirmHandle({ id }) {
      this.$dialog.confirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn vận lô?',
        confirmText: 'Vận lô',
        cancelText: 'Đóng',
        typeCancel: 'default',
        onConfirm: () => {
          this.createTrackingHandle(id)
        },
      })
    },
    async createTrackingHandle(id) {
      if (this.isFetching) return

      this.isFetching = true
      const res = await this.fulfillShipment(id)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success(
        'Lô hàng đang được xử lý tạo tracking, thông tin xử lý sẽ được cập nhật sau'
      )
      this.init()
    },

    cancelConfirmHandle({ id }) {
      this.$dialog.confirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn hủy lô hàng?',
        confirmText: 'Hủy',
        cancelText: 'Đóng',
        typeCancel: 'default',
        onConfirm: () => {
          this.cancelHandle(id)
        },
      })
    },
    async cancelHandle(id) {
      if (this.isFetching) return

      this.isFetching = true
      const res = await this.cancelShipment(id)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Hủy lô hàng thàng công')
      this.init()
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.keyword = ''
      this.filter.status = ''
      this.filter.page = 1
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
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
<style lang="scss">
.list-cus-shipment {
  .date-search {
    min-width: 250px;
  }
  .label-date-picker {
    color: #aaabab;
    margin-top: 6px;
    display: inline-block;
  }
  .vue-daterange-picker .reportrange-text span {
    margin-top: 6px;
    display: inline-block;
  }

  #date-search .show-ranges {
    min-width: 712px;
  }

  .table tbody tr td {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
