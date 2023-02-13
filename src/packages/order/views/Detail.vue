<template>
  <div class="pages">
    <div class="page-header mt-8 mb-8">
      <div class="header-meta d-flex">
        <div class="meta-info">
          <span class="title">Mã kiện</span>
          <span class="content b">{{ order.id || 'N/A' }}</span>
        </div>
        <div class="meta-info">
          <span class="title">Ngày tạo</span>
          <span class="content">{{
            order.created_at | datetime('dd/MM/yyyy - HH:mm')
          }}</span>
        </div>
        <div class="meta-info">
          <span class="title">Trạng thái kiện</span>
          <span class="content">
            <Status :status="order.status" />
          </span>
        </div>
        <div class="meta-info">
          <span class="title">Số lượng đơn</span>
          <span class="content">{{ order.count }}</span>
        </div>
      </div>
    </div>
    <div v-if="order && order.id" class="page-content">
      <div class="px-24 mb-16">
        <p-input
          placeholder="Tìm theo mã LionBay tracking"
          prefixIcon="search"
          type="search"
          :value="filter.search"
          @keyup.enter="handleSearch"
          :clearable="true"
          @reset="handleClearSearch"
        >
        </p-input>
      </div>
      <div class="card">
        <div class="card-body">
          <VclTable class="mt-20" v-if="isListFetching"></VclTable>
          <template v-else-if="packages.length">
            <div class="table-responsive">
              <table class="table table-hover table-packages" id="tbl-packages">
                <thead>
                  <tr>
                    <th>ORDER NO.</th>
                    <th>LIONBAY TRACKING</th>
                    <th>CREATED DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in packages" :key="item.id">
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
                    <td>{{ item.code }}</td>
                    <td>{{
                      item.created_at | datetime('dd/MM/yyyy HH:mm')
                    }}</td>
                    <td>
                      <span v-status="item.status_text"></span>
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
    <NotFound v-else />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import {
  FETCH_DETAIL_ORDER,
  FETCH_LIST_ORDER_PACKAGES,
  FETCH_COUNT_ORDER_PACKAGES,
} from '../store'
import NotFound from '@/components/shared/NotFound'
import mixinTable from '@core/mixins/table'
import mixinRoute from '@core/mixins/route'
import Status from './components/Status.vue'
import EmptySearchResult from '@components/shared/EmptySearchResult'

export default {
  name: 'OrderDetail',
  mixins: [mixinTable, mixinRoute],
  components: { Status, EmptySearchResult, NotFound },
  data() {
    return {
      isFetching: true,
      isListFetching: true,
      filter: {
        limit: 25,
        page: 1,
        search: '',
      },
    }
  },
  computed: {
    ...mapState('order', {
      order: (state) => state.order,
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
    }),
    orderID() {
      return parseInt(this.$route.params.id, 10)
    },
    filterForWatcher() {
      return { ...this.filter }
    },
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  mounted() {
    this.init()
    this.fetchPackages()
  },
  methods: {
    ...mapActions('order', {
      fetchDetail: FETCH_DETAIL_ORDER,
      fetchListPackages: FETCH_LIST_ORDER_PACKAGES,
      fetchCountPackages: FETCH_COUNT_ORDER_PACKAGES,
    }),

    async init() {
      this.isFetching = true
      const res = await this.fetchDetail(this.orderID)
      this.isFetching = false
      if (res.error) {
        this.$toast.error(res.message)
      }
    },

    async fetchPackages() {
      this.isListFetching = true

      this.handleUpdateRouteQuery()
      const filter = { id: this.orderID, ...this.filter }

      this.fetchCountPackages(filter)
      const res = await this.fetchListPackages(filter)
      this.isListFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async fetchListPackagesHandle() {
      this.isListFetching = true
      this.handleUpdateRouteQuery()

      const filter = { id: this.orderID, ...this.filter }
      const res = await this.fetchListPackages(filter)
      this.isListFetching = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }
    },

    async handleSearch(e) {
      this.filter.search = e.target.value.trim()
      this.filter.page = 1
    },
    async handleClearSearch() {
      this.filter.search = ''
      this.filter.page = 1
    },
  },
  watch: {
    filterForWatcher: {
      handler: function(val, old) {
        if (val.page != old.page && val.search === old.search) {
          this.fetchListPackagesHandle()
        } else {
          this.fetchPackages()
        }
      },
      deep: true,
    },
  },
}
</script>
