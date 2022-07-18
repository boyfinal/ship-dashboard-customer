<template>
  <div class="tracking_page pages">
    <div
      class="search__section"
      v-if="ListPackages.length == 0 && this.codes.length == 0"
    >
      <div class="title">
        <h2>Tra cứu hành trình đơn hàng</h2>
        <span>Theo dõi lên đến 50 Tracking cùng một lúc.</span>
      </div>

      <div class="search-form">
        <div class="search-input">
          <input
            class="input-1"
            @click="openInput()"
            v-model="code"
            placeholder="Vui lòng nhập mã tracking, các mã được phân tách nhau bởi dấu enter"
            :class="{ hidden: openTextarea }"
          />
          <modal-tracking
            class="input-multi"
            :class="{ 'input-multi-open': openTextarea }"
            id="textarea"
            :text.sync="code"
            @track="track"
          >
          </modal-tracking>
        </div>
        <div class="button-group">
          <button class="btn btn-tracking">
            <img src="~@/assets/img/box-search.png" alt="" /> Track</button
          >
        </div>
      </div>
      <div class="wrapper" @click="openTextarea = false"></div>
    </div>

    <div class="tracking__section" v-else>
      <div class="tracking__header">
        <div class="filter_tab">
          <ul class="tablist">
            <li class="nav-item">
              <a
                href="#"
                class="nav-link"
                @click="filterStatus('')"
                :class="{ active: filter.status == '' }"
              >
                All ({{ count }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link processing"
                @click="filterStatus(statusProcessing)"
                :class="{
                  active: filter.status == statusProcessing,
                }"
              >
                <inline-svg
                  :src="require('../../../assets/img/clock2.svg')"
                ></inline-svg>
                Processing ({{ CountStatusProcessing || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link in-transit"
                @click="filterStatus(statusInTransit)"
                :class="{
                  active: filter.status == statusInTransit,
                }"
                ><inline-svg
                  :src="require('../../../assets/img/transit.svg')"
                ></inline-svg>
                In-Transit ({{ CountStatusInTransit || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link delivered"
                @click="filterStatus(statusDelivered)"
                :class="{
                  active: filter.status == statusDelivered,
                }"
              >
                <inline-svg
                  :src="require('../../../assets/img/Tick-circle.svg')"
                ></inline-svg>
                Delivered ({{ CountStatusDelivered || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link undelivered"
                @click="filterStatus(statusUndelivered)"
                :class="{
                  active: filter.status == statusUndelivered,
                }"
              >
                <inline-svg
                  :src="require('../../../assets/img/un-delivered.svg')"
                ></inline-svg>
                Undelivered ({{ countStatusUndelivered || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link warning"
                @click="filterStatus(statusAlert)"
                :class="{
                  active: filter.status == statusAlert,
                }"
                ><inline-svg
                  :src="require('../../../assets/img/Warning-2.svg')"
                ></inline-svg>
                Alert ({{ CountStatusAlert || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link expried"
                @click="filterStatus(statusExpried)"
                :class="{
                  active: filter.status == statusExpried,
                }"
                ><inline-svg
                  :src="require('../../../assets/img/expried.svg')"
                ></inline-svg>
                Expired ({{ CountStatusExpried || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link notfound"
                @click="filterStatus(statusNotFound)"
                :class="{
                  active: filter.status == statusNotFound,
                }"
                ><inline-svg
                  :src="require('../../../assets/img/not-found.svg')"
                ></inline-svg>
                Not Found ({{ CountStatusNotFound || 0 }})
              </a>
            </li>
          </ul>
          <!-- <button
            class="btn btn-tracking btn-tracking-large"
            @click="openModalTracking"
          >
            <img src="~@/assets/img/box-search.png" alt="" /> Track Other
            Packages</button
          > -->
        </div>
      </div>

      <div class="tracking">
        <VclTable class="mt-20" v-if="isLoading"></VclTable>

        <template v-else-if="newListPackages.length">
          <div class="table-tracking col-9">
            <table class="table table-hover">
              <thead>
                <tr>
                  <!-- <th width="60"></th> -->
                  <th width="250">LIONBAY TRACKING</th>
                  <th width="250">LAST MILE TRACKING NO.</th>
                  <th width="150">ORIGIN / DESTINATION</th>
                  <th width="450">STATUS</th>
                  <th width="60">
                    <div class="d-flex btn-action-icon">
                      <copy
                        :value="dataCopy"
                        :texthover="'Copy all tracking'"
                        :textcopied="'Copy completed'"
                      >
                        <inline-svg
                          :src="
                            require('../../../assets/img/copy_tracking.svg')
                          "
                        ></inline-svg>
                      </copy>
                      <a
                        data-text-hover="Expand or collapse full details"
                        class="lb-tooltip"
                      >
                        <inline-svg
                          v-if="!open"
                          @click="openTrackingDetail"
                          :src="
                            require('../../../assets/img/expand_tracking.svg')
                          "
                        ></inline-svg>
                        <inline-svg
                          v-else
                          @click="closeTrackingDetail"
                          :src="
                            require('../../../assets/img/close_tracking.svg')
                          "
                        ></inline-svg>
                      </a>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                v-for="(item, i) in newListPackages"
                :key="i"
                :class="{ 'tbody-opened': opened.includes(item.id) }"
              >
                <tr
                  class="clickable-row"
                  :class="{ opened: opened.includes(item.id) }"
                  v-if="!item.notFound"
                >
                  <td
                    >{{ item.package_code.code }}
                    <br />
                    <span v-status="item.status_string"></span>
                    <span
                      class="badge badge-round badge-success"
                      v-if="item.status_string == statusDelivered"
                      >{{ dayDelivered(item) }}</span
                    >
                  </td>
                  <td
                    >{{ item.tracking ? item.tracking.tracking_number : '' }}
                    <br /><span>&nbsp;</span></td
                  >
                  <td
                    >VN &#x2192; {{ item.country_code }} <br /><span
                      >&nbsp;</span
                    ></td
                  >
                  <td v-if="item.log">
                    {{ item.log[0].description }}
                    <br />
                    <span class="location">{{ item.log[0].location }}</span>
                  </td>
                  <td class="icon"
                    ><div @click="toggle(item.id)">
                      <inline-svg
                        v-if="!opened.includes(item.id)"
                        :src="
                          require('../../../assets/img/expand_tracking.svg')
                        "
                      ></inline-svg>
                      <inline-svg
                        v-else
                        :src="require('../../../assets/img/close_tracking.svg')"
                      ></inline-svg></div
                  ></td>
                </tr>
                <tr v-else class="not-found">
                  <!-- <td>
                    <img src="~@/assets/img/iconNotFound.png" />
                  </td> -->
                  <td
                    >{{ item.package_code.code }}
                    <br />
                    <span>Not Found</span>
                  </td>
                  <td colspan="4"
                    ><span class="error"
                      >Không thể tìm thấy mã tracking này. Vui lòng kiểm tra lại
                      sau.</span
                    ></td
                  >
                </tr>
                <transition :key="'A' + i" name="fade" mode="out-in">
                  <tr
                    class="tracking-detail"
                    v-show="opened.includes(item.id) && !item.notFound"
                  >
                    <td colspan="5">
                      <div class="status">
                        <span>{{ item.status_string }} </span>
                        <div class="copy">
                          <span>
                            <copy
                              :value="item.detail"
                              :text="'Copy Detail'"
                              :texthover="'Copy detail'"
                              :textcopied="'Copy completed'"
                            >
                              <inline-svg
                                :src="
                                  require('../../../assets/img/copy_detail.svg')
                                "
                              ></inline-svg>
                            </copy>
                          </span>
                          <span class="ml-24">
                            <copy
                              :value="item.link"
                              :text="'Copy Link'"
                              :texthover="'Copy link'"
                              :textcopied="'Copy completed'"
                            >
                              <inline-svg
                                :src="
                                  require('../../../assets/img/copy_link.svg')
                                "
                              ></inline-svg>
                            </copy>
                          </span>
                        </div>
                      </div>

                      <div class="timeline-new">
                        <div
                          v-for="(item, i) in item.data"
                          :key="i"
                          :class="{
                            'first-item': i === 0,
                          }"
                          class="timeline-item-new"
                        >
                          <div class="item__right">
                            <div class="title">{{ item.name }}</div>
                          </div>
                          <div
                            v-for="(it, j) in item.data"
                            :key="j"
                            class="item__right__data"
                            :class="{
                              'first-data': j === 0,
                            }"
                          >
                            <div class="time">
                              {{ it.ship_time | datetime('HH:mm:ss') }}</div
                            >
                            <div class="des">
                              {{ convertDes(it) }}
                              <span class="location" v-if="it.location">
                                ___{{ it.location }}</span
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </transition>

                <tr class="sperate"></tr>
              </tbody>
            </table>

            <div
              class="d-flex justify-content-between align-items-center mb-16"
              v-if="count > 0 && ListPackages.length > filter.limit"
            >
              <p-pagination
                :total="countPackages"
                :perPage.sync="filter.limit"
                :current.sync="filter.page"
                :filterLimit="false"
                size="sm"
              ></p-pagination>
            </div>
          </div>
        </template>
        <empty-search-result v-else></empty-search-result>

        <modal-tracking class="col-3" :codes="listCode" @track="track">
        </modal-tracking>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { GET_LOGS } from '../store'
import Uniq from 'lodash/uniq'
import { datetime } from '../../../core/utils/datetime'
import {
  DELIVER_LOG_PACKAGE,
  PACKAGE_STATUS_DELIVERED_TEXT,
  PACKAGE_STATUS_PROCESSING_TEXT,
  PACKAGE_STATUS_IN_TRANSIT_TEXT,
  PACKAGE_STATUS_ALERT_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  PACKAGE_STATUS_CANCELLED_TEXT,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_STATUS_UNDELIVERED_TEXT,
} from '../../package/constants'
import ModalTracking from '../components/ModalTracking.vue'
import Copy from '../../bill/components/Copy.vue'
import mixinTable from '@core/mixins/table'
import EmptySearchResult from '@components/shared/EmptySearchResult'

export default {
  name: 'Tracking',
  mixins: [mixinTable],

  components: {
    ModalTracking,
    Copy,
    EmptySearchResult,
  },
  data() {
    return {
      code: '',
      listCode: [],
      logPackage: [],
      errText: '',
      open: false,
      opened: [],
      statusProcessing: PACKAGE_STATUS_PROCESSING_TEXT,
      statusInTransit: PACKAGE_STATUS_IN_TRANSIT_TEXT,
      statusDelivered: PACKAGE_STATUS_DELIVERED_TEXT,
      statusAlert: PACKAGE_STATUS_ALERT_TEXT,
      statusUndelivered: PACKAGE_STATUS_UNDELIVERED_TEXT,
      statusPendingPickup: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
      statusCancel: PACKAGE_STATUS_CANCELLED_TEXT,
      statusExpried: PACKAGE_STATUS_EXPIRED_TEXT,
      statusNotFound: 'Not Found',
      filter: {
        limit: 10,
        page: 1,
        status: '',
        alert: false,
      },
      newListPackages: [],
      countPackages: 0,
      openTextarea: false,
      visibleModal: false,
      dataCopy: '',
      isLoading: false,
    }
  },
  beforeMount() {
    this.code = ''
    this.listCode = []
    this.$store.commit('tracking/setPackage', null)
    this.logPackage = []
  },
  created() {
    let code = this.$route.query.nums
    if (code) {
      this.codes.push(code)
    }
  },
  computed: {
    ...mapState('tracking', {
      packages: (state) => state.packages,
      logs: (state) => state.logs,
      // count: (state) => state.countPackages,
      count_status: (state) => state.count_status,
      codes: (state) => state.codes,
    }),
    ListPackages: {
      get() {
        return this.packages == null
          ? this.notFoundCodes
          : this.packages
              .map((item) => {
                item = Object.assign({}, item, {
                  log: this.logs.filter((x) => x.package_id == item.id),
                  notFound: false,
                  link: `${process.env.VUE_APP_DOMAIN}/tracking?nums=${item.package_code.code}`,
                  detail: `Lionbay tracking: ${item.package_code.code}
Last mile tracking no.: ${item.tracking ? item.tracking.tracking_number : ''}
Status: ${item.status_string.charAt(0).toUpperCase() +
                    item.status_string.slice(1)} ${this.dayDelivered(item)}
Country: VN -> ${item.country_code}
Origin:\n`,
                })

                for (const log of item.log) {
                  item.detail += log.location
                    ? `${datetime(log.ship_time)} ${log.description}, ${
                        log.location
                      } \n`
                    : `${datetime(log.ship_time)} ${log.description} \n`
                }

                const times = item.log.map((item) =>
                  datetime(item.ship_time, 'dd-MM-yyyy')
                )
                let ConvertData = []
                const uniqTimes = Uniq(times)
                uniqTimes.forEach((element) =>
                  ConvertData.push({ name: element, data: [] })
                )
                ConvertData.forEach((x) =>
                  item.log.forEach(function(it) {
                    if (datetime(it.ship_time, 'dd-MM-yyyy') == x.name) {
                      x.data.push(it)
                    }
                  })
                )
                return Object.assign({}, item, {
                  data: ConvertData,
                })
              })
              .concat(this.notFoundCodes)
      },
      set(packages) {
        return packages
      },
    },
    CountStatusProcessing() {
      return this.count_status
        .filter((x) => x.status == this.statusProcessing)
        .map((x) => x.count)[0]
    },
    CountStatusInTransit() {
      return this.count_status
        .filter((x) => x.status == this.statusInTransit)
        .map((x) => x.count)[0]
    },
    CountStatusDelivered() {
      return this.count_status
        .filter((x) => x.status == this.statusDelivered)
        .map((x) => x.count)[0]
    },
    countStatusUndelivered() {
      return this.count_status
        .filter((x) => x.status == this.statusUndelivered)
        .map((x) => x.count)[0]
    },
    CountStatusAlert() {
      return this.ListPackages.filter((x) => x.alert > 0).length
    },
    CountStatusExpried() {
      return this.count_status
        .filter((x) => x.status == this.statusExpried)
        .map((x) => x.count)[0]
    },
    CountStatusNotFound() {
      return this.notFoundCodes.length
    },
    count() {
      return this.ListPackages.length
    },
    notFoundCodes() {
      let notFoundArr = []
      if (this.packages == null) {
        return this.listCode.map((x) => {
          return {
            package_code: { code: x },
            status_string: 'Not Found',
            notFound: true,
            log: [],
          }
        })
      }
      for (const item of this.listCode) {
        if (
          !this.packages.map((x) => x.package_code.code).includes(item) &&
          !this.packages
            .map((x) => (x.tracking ? x.tracking.tracking_number : []))
            .includes(item)
        ) {
          notFoundArr.push({
            package_code: { code: item },
            status_string: 'Not Found',
            notFound: true,
            log: [],
          })
        }
      }

      return notFoundArr
    },
  },

  mounted() {
    this.$router.onReady(() => {
      if (this.codes.length > 0) {
        this.listCode = this.codes.slice()
        this.track(this.codes)
      }
    })
  },
  methods: {
    ...mapActions('tracking', [GET_LOGS]),

    async track(codes) {
      this.isLoading = true
      this.listCode = codes

      const result = await this[GET_LOGS](this.listCode)

      if (result.error && result.message != 'Không tìm thấy') {
        this.listCode = []
        this.$toast.open({ type: 'error', message: result.message })
        return
      }
      this.errText = ''
      if (this.count / this.filter.limit == this.filter.page - 1) {
        this.filter.page--
      }
      this.filterStatus('')
      this.opened = []

      this.isLoading = false
    },

    verifyCode() {
      if (this.code == '') {
        this.errText = 'Vui lòng kiểm tra dữ liệu đầu vào!'
        this.$toast.open({ type: 'error', message: this.errText })
        return
      }

      var regex = /^[A-Za-z0-9\n\t ]+$/
      var isValid = regex.test(this.code.trim())
      if (!isValid) {
        this.errText = 'Mã tracking không hợp lệ'
        this.$toast.open({ type: 'error', message: this.errText })
        return
      }

      this.listCode = [
        ...new Set(
          this.code
            .toUpperCase()
            .trim()
            .split(/[\n\t ]/)
            .filter((x) => x != '')
        ),
      ]
      this.track(this.listCode)
    },

    clearListCode() {
      this.code = ''
      this.listCode = []
      this.$store.commit('tracking/setPackage', null)
      this.logPackage = []
    },

    filterStatus(status) {
      this.filter.status = status
      this.filter.page = 1
      this.filter.alert = false

      if (status == '') {
        this.countPackages = this.count
        this.newListPackages = this.paginate(
          this.ListPackages,
          this.filter.limit,
          this.filter.page
        )
        return
      }

      if (status == 'alert') {
        this.filter.alert = true
        this.countPackages = this.CountStatusAlert
        return
      }

      this.countPackages = this.count_status
        .filter((x) => x.status == status)
        .map((x) => x.count)[0]
      this.newListPackages = this.ListPackages.filter(
        (x) => x.status_string == status
      )
    },

    toggle(id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        this.opened.push(id)
      }
    },

    paginate(array, page_size, page_number) {
      return array.slice((page_number - 1) * page_size, page_number * page_size)
    },

    convertDes(data) {
      if (data.description == '') {
        return DELIVER_LOG_PACKAGE[data.type] || ''
      }
      return data.description
    },

    openTrackingDetail() {
      this.open = !this.open
      for (const item of this.ListPackages) {
        this.opened.push(item.id)
      }
    },
    closeTrackingDetail() {
      this.open = !this.open
      this.opened = []
    },

    openInput() {
      this.openTextarea = true

      setTimeout(() => {
        document.getElementById('input').focus()
      }, 300)
    },

    openModalTracking() {
      this.visibleModal = true
    },

    onChange() {
      this.code = this.code.replace(/ /g, '\n')
    },

    dayDelivered(item) {
      if (item.checkin_warehouse_at && item.delivered_at) {
        var dayCheckin = new Date(item.checkin_warehouse_at)
        var dayDelivered = new Date(item.delivered_at)
        var days = Math.abs(dayDelivered - dayCheckin) / (1000 * 3600 * 24)
        return `(${Math.floor(days)} days)`
      }
      return ''
    },
  },
  watch: {
    filter: {
      handler: function() {
        if (this.ListPackages) {
          if (!this.filter.alert) {
            this.newListPackages =
              this.filter.status != ''
                ? this.ListPackages.filter(
                    (x) => x.status_string == this.filter.status
                  ).slice(
                    (this.filter.page - 1) * this.filter.limit,
                    this.filter.page * this.filter.limit
                  )
                : this.ListPackages.slice(
                    (this.filter.page - 1) * this.filter.limit,
                    this.filter.page * this.filter.limit
                  )
            return
          }
          this.newListPackages = this.ListPackages.filter(
            (x) => x.alert > 0
          ).slice(
            (this.filter.page - 1) * this.filter.limit,
            this.filter.page * this.filter.limit
          )
          return
        }
        this.newListPackages = []
      },
      deep: true,
    },
    newListPackages: {
      handler: function() {
        this.dataCopy = ''
        for (const item of this.newListPackages) {
          this.dataCopy += `Lionbay tracking: ${item.package_code.code}
Last mile tracking no.: ${item.tracking ? item.tracking.tracking_number : ''}
Status: ${item.status_string.charAt(0).toUpperCase() +
            item.status_string.slice(1)} ${this.dayDelivered(item)}
Country: VN -> ${item.country_code}
Origin:\n`
          for (const log of item.log) {
            this.dataCopy += log.location
              ? `${datetime(log.ship_time)} ${log.description}, ${
                  log.location
                } \n`
              : `${datetime(log.ship_time)} ${log.description} \n`
          }
          this.dataCopy += '\n==============================================\n'
          this.dataCopy += `\n`
        }
      },
      deep: true,
    },
  },
}
</script>
