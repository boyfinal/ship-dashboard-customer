<template>
  <div class="pages list__claim">
    <div class="page-header d-flex jc-sb">
      <div class="page-header_title header-2">Đơn khiếu nại</div>
      <p-button type="primary" @click="handleModal">
        <inline-svg :src="require('../../../assets/img/plus.svg')"></inline-svg>
        Tạo khiếu nại
      </p-button>
    </div>
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="d-flex list__claim-search">
            <p-input
              placeholder="Tìm kiếm theo mã tracking"
              prefixIcon="search"
              class="mb-2"
              type="search"
              clearable
              :value.sync="filter.search"
              @keyup.enter="handleSearch"
            >
            </p-input>
          </div>
          <div class="list__claim-list">
            <status-tab
              v-model="filter.status"
              :status="claimStatus"
              :count="totalCount"
            />
            <vcl-table class="mt-20" v-if="isFetching"></vcl-table>
            <template v-else-if="listclaim.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr class="list__claim-title">
                      <th>MÃ KHIẾU NẠI</th>
                      <th>LIONBAY TRACKING </th>
                      <th>TIÊU ĐỀ</th>
                      <th>NGÀY TẠO</th>
                      <th>NGÀY CẬP NHẬT</th>
                      <th>TRẠNG THÁI </th>
                      <th>KẾT QUẢ</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, i) in listclaim" :key="i">
                      <td width="150">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'claim-detail',
                            params: { id: item.id },
                          }"
                        >
                          {{ item.id }}
                          <img
                            class="ml-10"
                            v-if="
                              item.status_rep == claimAdminReply &&
                                item.status != statusProcessed
                            "
                            src="@assets/img/messenger.svg"
                            alt=""
                          />
                        </router-link>
                      </td>
                      <td width="150">
                        <router-link
                          class="text-no-underline"
                          :to="{
                            name: 'package-detail',
                            params: {
                              id: item.object_id,
                            },
                          }"
                        >
                          {{ item.package_code }}
                        </router-link>
                      </td>
                      <td width="500">
                        <p-tooltip
                          :label="item.title"
                          size="large"
                          position="top"
                          type="dark"
                          :active="item.title.length > 30"
                        >
                          {{ truncate(item.title, 30) }}
                        </p-tooltip>
                      </td>
                      <td width="150">{{
                        item.created_at | datetime('dd/MM/yyyy')
                      }}</td>
                      <td width="150">{{
                        item.updated_at | datetime('dd/MM/yyyy')
                      }}</td>
                      <td width="150">
                        <span v-status="item.status" type="claim"></span>
                      </td>
                      <td width="150">{{
                        showResult(item) ? getTypeClaim(item.type) : ''
                      }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <EmptySearchResult v-else></EmptySearchResult>
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
        </div>
      </div>
    </div>

    <modal-add-claim
      :visible.sync="visibleModal"
      :title="`Khiếu nại`"
      @create="init"
    >
    </modal-add-claim>
  </div>
</template>
<script>
import EmptySearchResult from '../../../components/shared/EmptySearchResult'
import {
  CLAIM_STATUS,
  CLAIM_ADMIN_REPLY,
  TicketTypeReship,
  TicketTypeRefund,
  CLAIM_STATUS_PROCESSED,
  CLAIM_STATUS_PENDING,
} from '../constants'

import { truncate } from '@core/utils/string'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import ModalAddClaim from '../components/ModalAddClaim'
import { FETCH_CLAIMS } from '../store'
import { mapActions, mapState } from 'vuex'
import PButton from '../../../../uikit/components/button/Button'
export default {
  name: 'ListClaim',
  mixins: [mixinRoute, mixinTable],
  components: {
    PButton,
    EmptySearchResult,
    ModalAddClaim,
  },
  data() {
    return {
      filter: {
        limit: 20,
        search: '',
        status: '',
      },
      visibleModal: false,
      isFetching: false,
      claimStatus: CLAIM_STATUS,
      claimAdminReply: CLAIM_ADMIN_REPLY,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
  },
  computed: {
    ...mapState('claim', {
      count: (state) => state.count,
      listclaim: (state) => state.claims,
      totalCount: (state) => state.totalCount,
    }),
    statusProcessed() {
      return CLAIM_STATUS_PROCESSED
    },
  },
  methods: {
    ...mapActions('claim', [FETCH_CLAIMS]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      let result = await this[FETCH_CLAIMS](this.filter)
      if (result.error) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.isFetching = false
    },
    handleModal() {
      this.visibleModal = true
    },
    getTypeClaim(type) {
      switch (type) {
        case TicketTypeReship:
          return 'Vận chuyển lại'
        case TicketTypeRefund:
          return 'Hoàn tiền'
        default:
          return 'Đóng'
      }
    },
    handleSearch(e) {
      // Default result after search in page 1
      this.filter.page = 1
      this.$set(this.filter, 'search', e.target.value.trim())
    },
    showResult(claim) {
      return (
        claim.status == CLAIM_STATUS_PROCESSED ||
        claim.status == CLAIM_STATUS_PENDING
      )
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
