<template>
  <div class="list-packages pages">
    <div
      class="page-header"
      :class="{ 'on-scroll': scrollPosition > 90 && totalSelected > 0 }"
    >
      <div
        class="bulk-actions d-flex align-items-center"
        v-if="totalSelected > 0"
      >
        <div class="bulk-actions__main-bar">
          <p-button
            :disabled="createOrder(filter.status)"
            class="bulk-actions__selection-status"
            @click="handleWayBill"
            type="primary"
            >Tạo tracking</p-button
          >
          <p-button
            v-if="isReturnTab()"
            class="bulk-actions__selection-status"
            @click="handlerReturnPackages"
            type="lb-secondary"
            >Chuyển lại hàng</p-button
          >
          <p-button
            class="bulk-actions__selection-status"
            @click="handlerDownloadLables"
            :disabled="downloadLabel(filter.status)"
            type="lb-secondary"
            >Tải label</p-button
          >
          <p-button
            class="bulk-actions__selection-status"
            @click="handleExport"
            type="lb-secondary"
          >
            Tải Excel
          </p-button>
          <p-button
            :disabled="cancelOrder(filter.status)"
            class="bulk-actions__selection-status"
            @click="handlerCancelPackages"
            type="danger"
            >Hủy đơn</p-button
          >

          <span class="bulk-actions__selection-count">
            Bạn có <b>{{ selectionCountText }} </b> đơn hàng đang được chọn.
            Tổng tiền : <b>{{ selectionCountTotal | formatPrice }} </b></span
          >
        </div>
      </div>
      <div v-else class="action-header">
        <div class="d-flex page-header__input">
          <p-input
            placeholder="Tìm theo mã tracking hoặc mã đơn hàng"
            prefixIcon="search"
            type="search"
            v-model="searchCode"
            :suffix-func="handleSearchCode"
            @keyup.enter="handleSearchCode"
            :clearable="true"
            @reset="handleDeleteCode"
          >
          </p-input>
          <div class="d-flex date-search">
            <Datepicker
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
              @on-type="onFilterByDateType"
            />
          </div>
          <button class="search-advanced ml-12" @click="visibleModalSearch">
            <inline-svg
              :src="require('../../../assets/img/search-advanced.svg')"
            >
            </inline-svg>
            <span>Tìm nâng cao</span>
          </button>
          <div class="btn-action">
            <button
              class="pull-right btn-primary btn ml-2"
              @click="handleImport"
            >
              <inline-svg :src="require('../../../assets/img/uploadex.svg')">
              </inline-svg>
              <span>Nhập Excel</span>
            </button>
            <router-link
              :to="{ name: 'package-create' }"
              class="pull-right btn-lb-secondary btn"
              @click="handleImport"
            >
              <inline-svg
                :src="require('../../../assets/img/addactive.svg')"
              ></inline-svg>
              <span>Tạo đơn</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="scrollPosition > 100 && totalSelected > 0"
      class="page-header-temp"
    ></div>
    <div class="page-content">
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <package-status-tab
              :has-all="false"
              :status="statusTab"
              v-model="filter.status"
              :count-status="count_status"
            />
            <div
              v-if="isTabAlert"
              class="mt-20"
              style="position: relative;margin-bottom: -10px;padding-top:20px;"
            >
              <div
                class="order-select-checkbox p-checkbox checkbox-custom checkbox-primary"
              >
                <input
                  type="checkbox"
                  id="cb-alert"
                  @click="alertOverPreTransitToggle"
                  :checked="isCheckedAlertOverPreTransit"
                />
                <label for="cb-alert">
                  <span>Đơn chậm</span>
                </label>
              </div>
            </div>
            <VclTable class="mt-20" v-if="isFetching"></VclTable>
            <template v-else-if="packages.length">
              <div class="table-responsive">
                <table
                  class="table table-hover table-packages"
                  id="tbl-packages"
                >
                  <thead>
                    <tr>
                      <th width="40">
                        <p-checkbox
                          class="order-select-checkbox"
                          :class="{ checkAll: totalSelected > 0 }"
                          :style="totalSelected > 0 && { width: 0 }"
                          :value="isAllChecked"
                          @change.native="toggleSelectAll"
                          :indeterminate="isIndeterminate"
                        ></p-checkbox>
                      </th>
                      <template>
                        <th>Order no.</th>
                        <th>Lionbay tracking</th>
                        <th>Last mile tracking</th>
                        <th>Service</th>
                        <th>Created date</th>
                        <th>Accepted date</th>
                        <th width="160">status</th>
                        <th style="text-align: right">Total fee</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in packages"
                      :key="i"
                      :class="{
                        hover: isChecked(item),
                        deactive:
                          item.status_string == PackageStatusExpiredText,
                        'sm-view': isSmScreen,
                      }"
                    >
                      <td width="40">
                        <p-checkbox
                          v-model="action.selected"
                          :native-value="item"
                          @input="handleValue($event)"
                        >
                        </p-checkbox>
                      </td>
                      <td class="order-number">
                        <div class="d-flex justify-content-between">
                          <router-link
                            class="text-no-underline"
                            :to="{
                              name: 'package-detail',
                              params: {
                                id: item.id,
                              },
                            }"
                          >
                            {{ item.order_number }}
                          </router-link>
                          <span
                            v-if="!item.validate_address"
                            @click="handleValidateAddress(item)"
                            class="
                              list-warning
                              badge badge-round badge-warning-order
                            "
                            style="white-space: pre"
                          >
                            <p-tooltip
                              class="item_name"
                              :label="
                                `Địa chỉ không hợp lệ \n Kích vào đây để xác nhận rằng địa chỉ hiện tại chắc chắn hợp lệ`
                              "
                              position="top"
                              type="dark"
                            >
                              <inline-svg
                                :src="
                                  require('../../../assets/img/location-warning.svg')
                                "
                              ></inline-svg>
                            </p-tooltip>
                          </span>
                        </div>
                      </td>
                      <td class="action">
                        <span class="code">
                          <p-tooltip
                            :label="item.code"
                            v-if="showPackageCode(item)"
                            size="large"
                            position="top"
                            type="dark"
                            :active="item.code.length > 18"
                          >
                            <router-link
                              class="text-no-underline"
                              :to="{
                                name: 'package-detail',
                                params: {
                                  id: item.id,
                                },
                              }"
                            >
                              {{ truncate(item.code, 18) }}
                            </router-link>
                          </p-tooltip>
                          <span v-else class="no-pkg-code">N/A</span>
                        </span>

                        <span class="link">
                          <span class="svg" v-if="showPackageCode(item)">
                            <p-tooltip
                              class="item_name"
                              :label="` Copy `"
                              position="top"
                              type="dark"
                            >
                              <copy :value="item.code">
                                <svg
                                  width="32"
                                  height="32"
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle cx="16" cy="16" r="16" fill="none" />

                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M21.9823 11.3982H20.6372V10.0531C20.6372 8.92035 19.7168 8 18.6195 8H10.0531C8.92035 8 8 8.92035 8 10.0531V18.6195C8 19.7168 8.92035 20.6372 10.0531 20.6372H11.3982V21.9823C11.3982 23.115 12.2832 24 13.4159 24H21.9823C23.115 24 24 23.115 24 21.9823V13.4159C24 12.2832 23.115 11.3982 21.9823 11.3982ZM18.9735 11.3982H13.4159C12.2832 11.3982 11.3982 12.2832 11.3982 13.4159V18.9735H10.0531C9.9469 18.9735 9.84071 18.9381 9.80531 18.8673C9.73451 18.7965 9.69912 18.7257 9.69912 18.6195V10.0531C9.69912 9.9469 9.73451 9.84071 9.80531 9.80531C9.84071 9.73451 9.9469 9.69912 10.0531 9.69912H18.6195C18.7257 9.69912 18.7965 9.73451 18.8673 9.80531C18.9381 9.84071 18.9735 9.9469 18.9735 10.0531V11.3982Z"
                                    fill="#313232"
                                  />
                                </svg>
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
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="none" />

                                <path
                                  d="M21.7143 9.14286C21.7143 8.512 21.2023 8 20.5714 8H11.4286C10.7977 8 10.2857 8.512 10.2857 9.14286V10.2857H21.7143V9.14286Z"
                                  fill="#313232"
                                />
                                <path
                                  d="M22.8571 11.4286H9.14286C8.512 11.4286 8 11.9406 8 12.5714V19.4286C8 20.0594 8.512 20.5714 9.14286 20.5714H10.2857V22.8572C10.2857 23.488 10.7977 24 11.4286 24H20.5714C21.2023 24 21.7143 23.488 21.7143 22.8572V20.5714H22.8571C23.488 20.5714 24 20.0594 24 19.4286V12.5714C24 11.9406 23.488 11.4286 22.8571 11.4286ZM20.5714 22.8572H11.4286V17.1429H20.5714V22.8572ZM21.7143 14.8572H19.4286V13.7143H21.7143V14.8572Z"
                                  fill="#313232"
                                />
                                <path
                                  d="M16 20.5714H12.5714V21.7143H16V20.5714Z"
                                  fill="#313232"
                                />
                                <path
                                  d="M19.4286 18.2857H12.5714V19.4286H19.4286V18.2857Z"
                                  fill="#313232"
                                />
                              </svg>
                            </p-tooltip>
                          </span>

                          <span
                            class="svg"
                            v-if="
                              showPackageCode(item) && item.country_code != 'AU'
                            "
                          >
                            <p-tooltip
                              class="item_name"
                              :label="` Track `"
                              position="top"
                              type="dark"
                            >
                              <a
                                target="_blank"
                                :href="
                                  `https://t.17track.net/en#nums=${item.code}`
                                "
                              >
                                <svg
                                  width="32"
                                  height="32"
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle cx="16" cy="16" r="16" fill="none" />
                                  <g clip-path="url(#clip0_382_4459)">
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M12.0682 18.9542L8.14707 17.6451C7.95102 17.5204 7.95102 17.3957 8.14707 17.2711L23.4723 8.04502C23.6356 7.95151 23.701 8.01385 23.7337 8.13853L23.9951 22.5074C24.0278 22.7568 23.8971 22.8815 23.6356 22.7568L18.2114 20.9802L16.4795 23.9101C16.4142 24.0347 16.2508 24.0347 16.2508 23.8789L15.7607 20.0763L21.7404 11.5671L14.8784 18.2373C14.1268 18.9542 13.2119 19.2035 12.0682 18.9542Z"
                                      fill="#313232"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_382_4459">
                                      <rect
                                        width="16"
                                        height="16"
                                        fill="white"
                                        transform="translate(8 8)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </a>
                            </p-tooltip>
                          </span>
                        </span>
                      </td>
                      <td v-if="item.tracking_number && item">
                        <track-link
                          :current="item"
                          :is-sm-screen="isSmScreen"
                        />
                      </td>
                      <td v-else><span class="no-track-code">N/A</span> </td>
                      <td>
                        {{ item.service_name || 'N/A' }}
                      </td>
                      <td>{{ item.created_at | date('dd/MM/yyyy') }}</td>
                      <td>
                        <span v-if="item.accepted_at">
                          {{ item.accepted_at | date('dd/MM/yyyy') }}
                        </span>
                        <span v-else>N/A</span>
                      </td>
                      <td>
                        <span v-status="item.status_string"></span>
                        <span
                          v-if="item.alert > 0"
                          class="
                            pull-right
                            list-warning
                            badge badge-round badge-warning-order
                          "
                        >
                          <p-tooltip
                            class="item_name"
                            :label="description(item.alert)"
                            position="top"
                            type="dark"
                          >
                            <inline-svg
                              :src="require('../../../assets/img/warning.svg')"
                            ></inline-svg>
                          </p-tooltip>
                        </span>
                        <span
                          class="time-ago"
                          v-if="
                            item.delivered_at &&
                              item.accepted_at &&
                              item.status == PACKAGE_STATUS_DELIVERED
                          "
                        >
                          ({{
                            item.delivered_at
                              | distanceTime(
                                item.accepted_at || item.created_at
                              )
                          }})
                        </span>
                      </td>
                      <td
                        v-if="item.is_package_exceed"
                        style="text-align: right;color: #FA8C16"
                      >
                        <span class="pkg-exceed" v-if="!item.shipping_fee">
                          Đang tính giá
                        </span>
                        <p-tooltip
                          class="item_name"
                          :label="`Hàng quá cỡ`"
                          position="top"
                          type="dark"
                          v-else
                        >
                          <span class="pkg-exceed">
                            {{ convertPrice(item) | formatPrice }}
                          </span>
                        </p-tooltip>
                      </td>
                      <td v-else style="text-align: right">{{
                        convertPrice(item) | formatPrice
                      }}</td>
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
                >
                </p-pagination>
              </div>
            </template>
            <empty-search-result v-else></empty-search-result>
          </div>
        </div>
      </div>
    </div>
    <modal-import
      :visible.sync="isVisibleImport"
      :uploading="isUploading"
      accept=".csv"
      title="Nhập Excel"
      @selected="handleImportPackage"
      v-if="isVisibleImport"
    >
    </modal-import>
    <modal-import-preview-package
      :visible.sync="isVisiblePreview"
      :import-errors="resultImport.errors"
      :import-sucess="resultImport.import_sucess"
      :total="resultImport.total"
      v-if="isVisiblePreview"
      @close="handleClosePreview"
    ></modal-import-preview-package>
    <modal-export :visible="isVisibleExport"> </modal-export>
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
      @action="cancelPackagesAction"
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
      @action="pendingPickupPackagesAction"
    ></modal-confirm>

    <ModalConfirmAddress
      :visible.sync="visibleConfirmValidate"
      :address="confirmAddress"
      :loading="loadingValidate"
      @action="validateAddressPackage"
    >
    </ModalConfirmAddress>

    <ModalSearchAdvanced
      :visible.sync="isVisibleModalSearch"
      :loadingView="isFetching"
      :loadingExport="isVisibleExport"
      :filterPage="filter"
      @export="handleExport"
      @fetch="searchAdvanced"
    >
    </ModalSearchAdvanced>
  </div>
</template>
<script>
import ModalExport from './components/ModalExport'
import PackageStatusTab from './components/PackageStatusTab'
import ModalImportPreviewPackage from './components/ModalImportPreviewPackage'
import ModalImport from '@components/shared/modal/ModalImport'
import { mapState, mapActions } from 'vuex'
import mixinDownload from '@/packages/shared/mixins/download'
import ModalConfirm from '@components/shared/modal/ModalConfirm'
import mixinChaining from '@/packages/shared/mixins/chaining'
import ModalConfirmAddress from './components/ModalConfirmAddress'
import { formatPrice } from '@core/utils/formatter'
import Datepicker from './components/Datepicker.vue'

import {
  PACKAGE_STATUS_TAB,
  PACKAGE_STATUS_ARCHIVED,
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_RETURN_TEXT,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  PACKAGE_STATUS_PROCESSING_TEXT,
  PACKAGE_STATUS_IN_TRANSIT_TEXT,
  PACKAGE_STATUS_DELIVERED_TEXT,
  PACKAGE_STATUS_CANCELLED_TEXT,
  PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT,
  PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN,
  PACKAGE_ALERT_TYPE_HUB_RETURN,
  PACKAGE_STATUS_ALERT_TEXT,
  PACKAGE_STATUS_DELIVERED,
} from '../constants'
import {
  FETCH_LIST_PACKAGES,
  IMPORT_PACKAGE,
  EXPORT_PACKAGE,
  PROCESS_PACKAGE,
  CANCEL_PACKAGES,
  PENDING_PICKUP_PACKAGES,
  VALIDATE_ADDRESS,
} from '@/packages/package/store'
import EmptySearchResult from '@components/shared/EmptySearchResult'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { date } from '@core/utils/datetime'
import { truncate } from '@core/utils/string'
import { print } from '@core/utils/print'
import api from '../api'

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { SET_LOADING } from '../store'
import Copy from '../../bill/components/Copy.vue'
import ModalSearchAdvanced from './components/ModalSearchAdvanced'
import { extension } from '../../../core/utils/url'
import TrackLink from './components/Track.vue'

export default {
  name: 'ListPackages',
  mixins: [mixinRoute, mixinTable, mixinDownload, mixinChaining],
  components: {
    ModalImport,
    ModalImportPreviewPackage,
    EmptySearchResult,
    PackageStatusTab,
    ModalExport,
    ModalConfirm,
    Copy,
    ModalConfirmAddress,
    ModalSearchAdvanced,
    TrackLink,
    Datepicker,
  },
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
        code: '',
        alert: 0,
        by_date: '',
      },
      labelDate: `Tìm theo ngày`,
      isUploading: false,
      isVisibleExport: false,
      isVisiblePreview: false,
      isVisibleImport: false,
      importData: {
        file: null,
      },
      importDataErrors: {},
      resultImport: {},
      searchCode: '',
      allowSearch: true,
      isFetching: false,
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
      isVisibleConfirmWayBill: false,
      visibleConfirmCancel: false,
      visibleConfirmReturn: false,
      visibleConfirmValidate: false,
      selected: [],
      idSelected: 0,
      PackageStatusExpiredText: PACKAGE_STATUS_EXPIRED_TEXT,
      windowWidth: 0,
      isSmScreen: false,
      confirmAddress: '',
      loadingValidate: false,
      scrollPosition: null,
      isVisibleModalSearch: false,
      PACKAGE_STATUS_DELIVERED: PACKAGE_STATUS_DELIVERED,
    }
  },
  created() {
    this.filter = this.getRouteQuery()
    this.searchCode = this.filter.code
    window.addEventListener('resize', this.checkScreen)
    this.checkScreen()
  },
  computed: {
    ...mapState('package', {
      packages: (state) => state.packages,
      count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
      hiddenClass() {
        return this.action.selected.length > 0 || this.isAllChecked
      },
      isFilterInitTab() {
        return this.filter.status_string === PACKAGE_STATUS_CREATED_TEXT
      },
      items() {
        return this.packages
      },
    }),
    statusTab() {
      return PACKAGE_STATUS_TAB
    },
    isTabAlert() {
      return this.filter.status == PACKAGE_STATUS_ALERT_TEXT
    },
    isCheckedAlertOverPreTransit() {
      return this.filter.alert == PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT
    },
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PACKAGES,
      IMPORT_PACKAGE,
      EXPORT_PACKAGE,
      PROCESS_PACKAGE,
      CANCEL_PACKAGES,
      PENDING_PICKUP_PACKAGES,
      VALIDATE_ADDRESS,
      SET_LOADING,
    ]),
    truncate,
    async init() {
      this.isFetching = true
      this.handleUpdateRouteQuery()
      this.action.selected = []
      const result = await this.fetchListPackages(this.filter)
      this.isFetching = false
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
        return
      }
      this.isVisibleModalSearch = false
    },
    async searchAdvanced(filter) {
      this.filter = { ...filter, status: '' }
      console.log(filter, this.filter)
    },
    showPackageCode(item) {
      if (item.status === PACKAGE_STATUS_ARCHIVED) {
        return false
      }
      return item.code !== ''
    },
    convertPrice(item) {
      if (item.status_string == PACKAGE_STATUS_CREATED_TEXT) {
        return this.calculateFee(item.weight) + item.shipping_fee
      } else {
        return item.shipping_fee
      }
    },
    selectDate(v) {
      this.filter.start_date = date(v.startDate, 'yyyy-MM-dd')
      this.filter.end_date = date(v.endDate, 'yyyy-MM-dd')
    },
    handleSearchCode() {
      this.filter.page = 1
      this.searchCode = this.searchCode.trim()
      this.$set(this.filter, 'code', this.searchCode)
    },
    updateQuery(e) {
      this.filter.page = 1
      this.searchCode = e
      this.$set(this.filter, 'code', this.searchCode)
    },
    handleClosePreview() {
      this.filter = {
        limit: 20,
        status: '',
        search: '',
        start_date: '',
        end_date: '',
        code: '',
        by_date: '',
      }
      this.init()
    },
    handleImport() {
      this.isVisibleImport = true
    },
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    destroy() {
      window.removeEventListener('scroll', this.updateScroll)
    },
    clearSearchDate() {
      this.filter.end_date = ''
      this.filter.start_date = ''
      this.filter.search = ''
      this.filter.by_date = ''
      this.filter.search_by = ''
      this.filter.status_arr = []
      this.filter.page = 1
    },
    async handleImportPackage(file, template) {
      this.importData.file = file
      this.isUploading = true
      this.resultImport = await this[IMPORT_PACKAGE]({
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
    async handleExport(filter) {
      this.isVisibleExport = true
      let result
      if (this.selectedIds.length > 0) {
        result = await this[EXPORT_PACKAGE]({
          ids: this.selectedIds,
        })
      } else {
        result = await this[EXPORT_PACKAGE]({
          search: filter.search,
          search_by: filter.search_by,
          status_arr: filter.status_arr,
          start_date: filter.start_date,
          end_date: filter.end_date,
          alert: filter.alert,
        })
      }

      this.isVisibleExport = false

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.isVisibleModalSearch = false

      this.downloadFile(
        result.url,
        'packages',
        result.url.split('/'),
        'danh_sach_van_don_'
      )
    },
    isReturnTab() {
      return this.filter.status === PACKAGE_STATUS_PENDING_PICKUP_TEXT
    },
    checkScreen() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 1440) {
        this.isSmScreen = true
        return
      }
      this.isSmScreen = false
    },
    createOrder(value) {
      switch (value) {
        case PACKAGE_STATUS_CREATED_TEXT:
          return false
        case PACKAGE_STATUS_PENDING_PICKUP_TEXT:
          return true
        case PACKAGE_STATUS_PROCESSING_TEXT:
          return true
        case PACKAGE_STATUS_IN_TRANSIT_TEXT:
          return true
        case PACKAGE_STATUS_DELIVERED_TEXT:
          return true
        case PACKAGE_STATUS_RETURN_TEXT:
          return true
        case PACKAGE_STATUS_CANCELLED_TEXT:
          return true
        case PACKAGE_STATUS_EXPIRED_TEXT:
          return true
        default:
          return false
      }
    },

    cancelOrder(status) {
      switch (status) {
        case PACKAGE_STATUS_CREATED_TEXT:
          return false
        case PACKAGE_STATUS_PENDING_PICKUP_TEXT:
          return false
        case PACKAGE_STATUS_PROCESSING_TEXT:
          return true
        case PACKAGE_STATUS_IN_TRANSIT_TEXT:
          return true
        case PACKAGE_STATUS_DELIVERED_TEXT:
          return true
        case PACKAGE_STATUS_RETURN_TEXT:
          return true
        case PACKAGE_STATUS_CANCELLED_TEXT:
          return true
        case PACKAGE_STATUS_EXPIRED_TEXT:
          return true
        default:
          return false
      }
    },
    handleValue(e) {
      this.selected = JSON.parse(JSON.stringify(e))
    },
    handlerCancelPackages() {
      const selectedInvalid = this.selected.filter(
        (ele) =>
          ele.status_string !== PACKAGE_STATUS_CREATED_TEXT &&
          ele.status_string !== PACKAGE_STATUS_PENDING_PICKUP_TEXT
      )
      if (selectedInvalid.length > 0) {
        let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number)
        if (codeSelectedInvalid.length > 3) {
          codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), '...']
        }

        return this.$toast.open({
          type: 'error',
          message: `Đơn hàng ${codeSelectedInvalid.join(
            ', '
          )} không thể hủy đơn.`,
          duration: 5000,
        })
      }
      this.actions.cancelPackage.Description = `Tổng số đơn hàng đang chọn là ${this.selectedIds.length}. Bạn có chắc chắn muốn hủy đơn?`
      this.visibleConfirmCancel = true
    },
    handlerReturnPackages() {
      const selectedInvalid = this.selected.filter(
        (ele) =>
          ele.status_string !== PACKAGE_STATUS_PENDING_PICKUP_TEXT ||
          ele.alert != PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN
      )

      if (selectedInvalid.length > 0) {
        let codeSelectedInvalid = selectedInvalid.map((ele) => ele.code)
        if (codeSelectedInvalid.length > 3) {
          codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), '...']
        }
        return this.$toast.open({
          type: 'error',
          message: `Đơn hàng ${codeSelectedInvalid.join(
            ', '
          )} không thể chuyển lại hàng.`,
          duration: 5000,
        })
      }
      this.actions.returnPackage.Description = `Tổng số đơn hàng đang chọn là ${this.selectedIds.length}. Bạn có chắc chắn muốn chuyển lại hàng ?`
      this.visibleConfirmReturn = true
    },
    async pendingPickupPackagesAction() {
      const payload = {
        ids: this.selectedIds,
      }
      this.actions.returnPackage.loading = true
      const result = await this[PENDING_PICKUP_PACKAGES](payload)
      this.visibleConfirmReturn = false
      this.actions.returnPackage.loading = false
      if (!result || !result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      this.init()
      this.$toast.open({
        type: 'success',
        message: 'Chuyển lại hàng thành công',
        duration: 3000,
      })
    },
    async cancelPackagesAction() {
      const payload = {
        ids: this.selectedIds,
      }
      this.actions.cancelPackage.loading = true
      const result = await this[CANCEL_PACKAGES](payload)
      this.visibleConfirmCancel = false
      this.actions.cancelPackage.loading = false
      if (!result || !result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      this.init()
      this.$toast.open({
        type: 'success',
        message: 'Hủy đơn thành công',
        duration: 3000,
      })
    },
    handleWayBill() {
      let selectedInvalid = this.selected.filter(
        (ele) => ele.status_string !== PACKAGE_STATUS_CREATED_TEXT
      )
      if (selectedInvalid.length > 0) {
        let codeSelectedInvalid = selectedInvalid.map((ele) => ele.order_number)
        if (codeSelectedInvalid.length > 3) {
          codeSelectedInvalid = [...codeSelectedInvalid.slice(0, 3), '...']
        }
        return this.$toast.open({
          type: 'error',
          message: `Đơn hàng ${codeSelectedInvalid.join(
            ', '
          )} không thể tạo tracking.`,
          duration: 5000,
        })
      }
      this.actions.wayBill.Description = `Tổng số đơn hàng đang chọn là <b> ${
        this.selected.length
      } </b>. Tổng tiền là <b> ${formatPrice(
        this.selectionCountTotal
      )} </b> bạn có chắc chắn muốn tạo tracking?`
      this.isVisibleConfirmWayBill = true
    },
    async handleActionWayBill() {
      let ids
      ids = this.selected.map((item) => item.id)

      let params = {
        ids: ids,
      }

      this.actions.wayBill.loading = true
      const result = await this.processPackage(params)
      this.isVisibleConfirmWayBill = false
      this.actions.wayBill.loading = false

      if (!result || !result.success) {
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }

      this.init()
      let msg = 'Tạo tracking thành công'
      if (result.promotion_label) {
        msg =
          'Đơn hàng đang được xử lý tạo tracking, thông tin xử lý sẽ được cập nhật sau'
      }
      this.$toast.open({
        type: 'success',
        message: msg,
        duration: 3000,
      })
    },

    async showContent(item) {
      document.activeElement && document.activeElement.blur()
      try {
        print(item.label)
      } catch (error) {
        this.$toast.error('File error !!!')
      }
    },

    handleValidateAddress(item) {
      this.confirmAddress = item.address_1 ? item.address_1 : item.address_2
      this.idSelected = item.id
      this.visibleConfirmValidate = true
    },
    async validateAddressPackage() {
      this.loadingValidate = true
      const payload = {
        ids: [this.idSelected],
      }
      const result = await this[VALIDATE_ADDRESS](payload)
      if (!result || !result.success) {
        this.visibleConfirmValidate = false
        this.loadingValidate = false
        return this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
      }
      setTimeout(() => {
        this.visibleConfirmValidate = false
        this.confirmAddress = ''
        this.loadingValidate = false
        this.init()
      }, 1000)
    },

    async handlerDownloadLables() {
      // this[SET_LOADING](true)
      var files = []
      var selected = this.selected.map((x) => {
        return {
          order_number: x.order_number,
          code: x.code,
          url: x.label,
        }
      })

      if (this.filter.status == '') {
        var countEmpty = selected.filter((element) => element.url === '').length
        if (countEmpty == this.selected.length) {
          this.$toast.open({
            type: 'error',
            message: 'Đơn được chọn không có label ! ',
            duration: 3000,
          })
          return
        }
      }

      for (const item of selected) {
        if (item.url === '') {
          continue
        }
        const res = await api.fetchBarcodeFile({
          url: item.url,
          type: 'labels',
        })
        if (!res && res.error) {
          this.$toast.open({
            type: 'error',
            message: res.errorMessage,
            duration: 3000,
          })
          continue
        }

        let ext = extension(item.url)
        ext = ext == 'pdf' ? ext : 'png'

        res['name'] = item.order_number + '_' + item.code + '.' + ext
        files.push(res)
      }

      this[SET_LOADING](false)

      var zip = new JSZip()
      Array.from(files).forEach((file) => {
        zip.file(file.name, file)
      })
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        saveAs(content, 'label.zip')
      })
    },
    handleDeleteCode() {
      this.searchCode = ''
      this.filter.code = ''
    },
    downloadLabel() {
      switch (this.filter.status) {
        case PACKAGE_STATUS_CREATED_TEXT:
          return true
        case PACKAGE_STATUS_PENDING_PICKUP_TEXT:
          return false
        case PACKAGE_STATUS_PROCESSING_TEXT:
          return false
        case PACKAGE_STATUS_IN_TRANSIT_TEXT:
          return false
        case PACKAGE_STATUS_DELIVERED_TEXT:
          return false
        case PACKAGE_STATUS_RETURN_TEXT:
          return false
        case PACKAGE_STATUS_CANCELLED_TEXT:
          return true
        case PACKAGE_STATUS_EXPIRED_TEXT:
          return true
        default:
          return false
      }
    },
    description(alert) {
      switch (alert) {
        case PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT:
          return 'Quá 7 ngày chờ lấy'
        case PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN:
          return 'Bị kho trả lại'
        case PACKAGE_ALERT_TYPE_HUB_RETURN:
          return 'Hàng bị trả lại'
      }
    },
    visibleModalSearch() {
      this.isVisibleModalSearch = true
    },
    alertOverPreTransitToggle(e) {
      if (e.target.checked) {
        this.filter.alert = PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT
      } else {
        this.filter.alert = 0
      }
    },
    onFilterByDateType(val) {
      this.filter.by_date = val
    },
  },
  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
    'filter.status': function(value) {
      if (!!value && value.status != PACKAGE_STATUS_ALERT_TEXT) {
        this.filter.alert = 0
      }
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
.table-packages .time-ago {
  font-size: 12px;
  color: #898a8a;
  font-weight: 400;
}
</style>
