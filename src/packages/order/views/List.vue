<template>
  <div class="pages">
    <div class="page-header">
      <div class="action-header d-flex justify-content-between">
        <div class="page-header__input mr-30" style="flex: 1;">
          <p-input
            placeholder="Tìm theo mã tracking hoặc mã kiện hàng"
            prefixIcon="search"
            type="search"
            :value="filter.search"
            @keyup.enter="handleSearch"
            :clearable="true"
            @reset="handleClearSearch"
          >
          </p-input>
        </div>
        <div class="d-flex">
          <div class="filter-date d-flex">
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
            <status-tab v-model="filter.status" :statics="statics" />
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="orders.length">
              <div class="table-responsive">
                <table
                  class="table table-hover table-packages"
                  id="tbl-packages"
                >
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>NUMBER ORDERS</th>
                      <th>CREATED DATE</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in displayItems" :key="item.id">
                      <td class="order-number">
                        <div class="d-flex justify-content-between">
                          <router-link
                            class="text-no-underline"
                            :to="{
                              name: 'order-detail',
                              params: { id: item.id },
                            }"
                          >
                            {{ item.id }}
                          </router-link>
                        </div>
                      </td>
                      <td>{{ item.count }}</td>
                      <td>{{
                        item.created_at | datetime('dd/MM/yyyy HH:mm')
                      }}</td>
                      <td>
                        <Status :status="item.status" />
                      </td>
                      <td class="action">
                        <span
                          class="code"
                          @click.prevent="exportHandle(item.id)"
                        >
                          <p-tooltip label="Download" type="dark">
                            <inline-svg
                              :src="require('../../../assets/img/down.svg')"
                            ></inline-svg>
                          </p-tooltip>
                        </span>
                        <span
                          v-if="item.has_delete"
                          class="code ml-10"
                          @click.prevent="deleteHandle(item.id)"
                        >
                          <p-tooltip label="Delete" type="dark">
                            <inline-svg
                              :src="require('../../../assets/img/trash.svg')"
                            ></inline-svg>
                          </p-tooltip>
                        </span>
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
    <ModalImport :visible.sync="isShowModalImport" @success="importSuccess" />
  </div>
</template>
<script>
import ModalImport from './components/ModalImport.vue'
import StatusTab from './components/StatusTab.vue'
import Status from './components/Status.vue'
import { mapState, mapActions } from 'vuex'
import {
  FETCH_COUNT_ORDERS,
  FETCH_LIST_ORDERS,
  EXPORT_ORDER,
  FETCH_ORDER_STATICS,
  DELETE_ORDER,
} from '../store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { MAP_ORDER_STATUS, ORDER_STATUS_IN_TRANSIT } from '../constants'
import mixinDownload from '@/packages/shared/mixins/download'

export default {
  name: 'ListOrders',
  mixins: [mixinRoute, mixinTable, mixinDownload],
  components: { ModalImport, StatusTab, Status, EmptySearchResult },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  data() {
    return {
      filter: {
        limit: 25,
        status: '',
        search: '',
        start_date: '',
        end_date: '',
      },
      isFetching: false,
      isShowModalImport: false,
    }
  },

  created() {
    this.filter = this.getRouteQuery()
  },

  computed: {
    ...mapState('order', {
      orders: (state) => state.orders,
      count: (state) => state.count,
      statics: (state) => state.statics,
    }),

    displayItems() {
      return this.orders.map((item) => {
        const hasDelete = item.status == ORDER_STATUS_IN_TRANSIT
        return { ...item, has_delete: hasDelete }
      })
    },
  },

  methods: {
    ...mapActions('order', {
      fetchList: FETCH_LIST_ORDERS,
      fetchCount: FETCH_COUNT_ORDERS,
      exportOrder: EXPORT_ORDER,
      fetchStatics: FETCH_ORDER_STATICS,
      deleteOrder: DELETE_ORDER,
    }),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()

      const filter = { ...this.filter }
      filter.status = MAP_ORDER_STATUS[filter.status]

      this.fetchCount(filter)
      this.fetchStatics(filter)
      const res = await this.fetchList(filter)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async fetchHandle() {
      this.isFetching = true

      const filter = { ...this.filter }
      filter.status = MAP_ORDER_STATUS[filter.status]
      const res = await this.fetchList(filter)
      this.isFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async handleSearch(e) {
      this.filter.search = e.target.value.trim()
      this.filter.page = 1
    },

    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
    },

    handleClearSearch() {
      this.filter.search = ''
      this.filter.page = 1
    },

    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },

    async handleImport() {
      this.isShowModalImport = true
    },
    importSuccess() {
      this.init()
    },
    async exportHandle(id) {
      console.log(id)
      const res = await this.exportOrder(id)
      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.downloadFile(res.path, 'packages', '', `kien_hang_${id}_date`)
    },
    deleteHandle(id) {
      this.$dialog.confirm({
        title: 'Xóa kiện hàng',
        message: `Bạn có thực sự muốn xóa kiên hàng #${id}?`,
        type: 'danger',
        typeCancel: 'default',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        onConfirm: async () => {
          const res = await this.deleteOrder(id)
          if (res.error) {
            this.$toast.error(res.message)
            return
          }

          this.init()
        },
      })
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
