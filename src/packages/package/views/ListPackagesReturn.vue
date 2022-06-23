<template>
  <div class="list-packages pages">
    <div class="page-header">
      <div class="action-header">
        <div class="d-flex page-header__input">
          <p-input
            placeholder="Tìm theo mã tracking hoặc mã đơn hàng"
            prefixIcon="search"
            type="search"
            :value="filter.search"
            :suffix-func="handleSearchCode"
            @keyup.enter="handleSearchCode"
            :clearable="true"
            @reset="handleDeleteCode"
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
              @clear="clearSearchDate"
            ></p-datepicker>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="items.length">
              <div class="table-responsive">
                <table
                  class="table table-hover table-return-packages"
                  id="tbl-packages"
                >
                  <thead>
                    <tr>
                      <th>order no.</th>
                      <th>Lionbay tracking</th>
                      <th>last mile tracking</th>
                      <th>Lý do</th>
                      <!-- <th>
                        RESHIP FEE
                        <p-tooltip
                          label="Phí tính theo thời điểm yêu cầu reship được xử lý."
                          size="large"
                          position="top"
                          type="dark"
                          :active="true"
                          class="pre"
                        >
                          <inline-svg
                            :src="
                              require('../../../assets/img/ask.svg')
                            "
                          ></inline-svg>
                        </p-tooltip>
                      </th> -->
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in displayItems"
                      :key="i"
                      :class="{ hover: item.checked }"
                    >
                      <td class="order-number">
                        <div class="d-flex justify-content-between">
                          <router-link
                            class="text-no-underline"
                            :to="{
                              name: 'package-detail',
                              params: {
                                id: item.package_id,
                              },
                            }"
                          >
                            {{ item.order_number }}
                          </router-link>
                        </div>
                      </td>
                      <td class="action">
                        <span class="code" v-if="item.package_code">
                          <!-- <p-tooltip
                            :label="item.package_code"
                            size="large"
                            position="top"
                            type="dark"
                            :active="item.package_code.length > 18"
                          > -->
                          <router-link
                            class="text-no-underline"
                            :to="{
                              name: 'package-detail',
                              params: {
                                id: item.package_id,
                              },
                            }"
                          >
                            {{ item.package_code }}
                          </router-link>
                          <!-- </p-tooltip> -->
                        </span>
                        <span v-else class="no-pkg-code">N/A</span>
                        <template class="link" v-if="item.package_code">
                          <span class="svg">
                            <p-tooltip
                              class="item_name"
                              :label="` Copy `"
                              position="top"
                              type="dark"
                            >
                              <copy :value="item.package_code">
                                <p-svg-copy></p-svg-copy>
                              </copy>
                            </p-tooltip>
                          </span>

                          <span
                            @click="showContent(item)"
                            v-if="item.label"
                            class="svg"
                          >
                            <p-tooltip
                              class="item_name"
                              :label="` Print `"
                              position="top"
                              type="dark"
                            >
                              <p-svg-print></p-svg-print>
                            </p-tooltip>
                          </span>

                          <span class="svg">
                            <p-tooltip
                              class="item_name"
                              :label="` Track `"
                              position="top"
                              type="dark"
                            >
                              <a target="_blank" :href="item.code_link">
                                <p-svg-send></p-svg-send>
                              </a>
                            </p-tooltip>
                          </span>
                        </template>
                      </td>
                      <td>
                        <a
                          class="tracking"
                          v-if="item.tracking_number"
                          :href="item.track_link"
                          target="_blank"
                        >
                          <p-tooltip
                            :label="item.tracking_number"
                            size="large"
                            position="top"
                            type="dark"
                            :active="item.tracking_number.length > 25"
                          >
                            {{ truncate(item.tracking_number, 25) }}
                            <inline-svg
                              :src="
                                require('../../../assets/img/arrow-up-right.svg')
                              "
                            ></inline-svg>
                          </p-tooltip>
                        </a>
                        <span v-else class="no-track-code">N/A</span>
                      </td>
                      <td>{{ item.description || 'N/A' }}</td>
                      <!-- <td>{{ item.amount | formatPrice }}</td> -->
                      <td>
                        <button
                          v-if="item.is_reship"
                          class="btn btn-primary"
                          disabled
                          >Processing</button
                        >
                        <button
                          v-else
                          class="btn btn-primary"
                          @click="showModalReshipHandle(item)"
                          >Reship</button
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
                  :perPage.sync="filter.limit"
                  :current.sync="filter.page"
                  size="sm"
                ></p-pagination>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
      </div>
    </div>
    <modal-reship
      :visible.sync="isVisibleReship"
      :current="current"
      @success="init"
    >
    </modal-reship>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

import {
  FETCH_PACKAGES_RETURN,
  FETCH_PACKAGE_DETAIL,
} from '@/packages/package/store'

import ModalReship from './components/ModalReship'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { truncate } from '@core/utils/string'
import { printImage } from '@core/utils/print'
import api from '../api'

import Copy from '../../bill/components/Copy.vue'

export default {
  name: 'ListPackagesReturn',
  mixins: [mixinRoute, mixinTable],
  components: {
    EmptySearchResult,
    ModalReship,
    Copy,
  },
  mounted() {},
  data() {
    return {
      current: {},
      filter: {
        limit: 25,
        page: 1,
        search: '',
        start_date: '',
        end_date: '',
      },
      labelDate: `Tìm theo ngày`,
      isFetching: false,
      isVisibleReship: false,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('package', {
      packages: (state) => state.package_returns,
      count: (state) => state.count_package_return,
      package: (state) => (state.package_detail || {}).package || {},
    }),
    items() {
      return this.packages.map(({ package_id }) => package_id)
    },
    displayItems() {
      return this.packages.map((item) => {
        return {
          ...item,
          code_link: `https://t.17track.net/en#nums=${item.package_code}`,
          track_link: `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${item.tracking_number}`,
          checked: this.isChecked(item.package_id),
          amount:
            parseFloat(item.shipping_fee || 0) +
            parseFloat(item.reship_extra_fee || 0),
          is_reship: item.request_reship,
        }
      })
    },
  },
  methods: {
    truncate,
    ...mapActions('package', [FETCH_PACKAGES_RETURN, FETCH_PACKAGE_DETAIL]),

    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.action.selected = []
      const result = await this.fetchPackagesReturn(this.filter)
      this.isFetching = false
      if (!result.success && result.message) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
    },

    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },

    handleSearchCode(e) {
      this.filter.page = 1
      this.filter.search = (e.target.value || '').trim()
    },

    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.page = 1
    },

    async showContent(item) {
      document.activeElement && document.activeElement.blur()

      const res = await api.fetchBarcodeFile({
        url: item.label,
        type: 'labels',
      })
      if (!res && res.error) {
        this.$toast.open({
          type: 'error',
          message: res.errorMessage,
          duration: 3000,
        })
        return
      }

      try {
        let blob = (window.webkitURL || window.URL).createObjectURL(res)
        printImage(blob)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },

    handleDeleteCode() {
      this.filter.search = ''
    },

    async showModalReshipHandle({ package_id }) {
      this.current = {}
      const res = await this[FETCH_PACKAGE_DETAIL](package_id)
      if (!res.success) {
        this.$toast.error(res.message)
        return
      }

      this.isVisibleReship = true
      this.current = this.package
    },
  },
  watch: {
    'filter.start_date': function() {
      this.filter.page = 1
    },
    'filter.end_date': function() {
      this.filter.page = 1
    },
    'filter.search': function() {
      this.filter.page = 1
    },
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="scss">
.p-tooltip::after {
  width: auto !important;
  white-space: pre;
}
.deactive {
  td {
    color: #cfd0d0;

    .badge {
      opacity: 0.6;
    }
  }

  a {
    color: #cfd0d0 !important;
  }
}
.no-pkg-code {
  min-width: 165px;
}
.no-track-code,
.no-pkg-code {
  position: relative;
  left: 52px;
  display: inline-block;
}
</style>
