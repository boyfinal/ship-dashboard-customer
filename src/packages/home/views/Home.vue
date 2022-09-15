<template>
  <div class="home-page pages pb-5">
    <div class="container">
      <div class="page-content">
        <div class="page-header">
          <div class="d-flex justify-content-between">
            <h3 class="page-title">Dashboard</h3>
            <div class="actions">
              <select v-model="time">
                <option value="d7">7 ngày gần đây</option>
                <option value="d14">14 ngày gần đây</option>
                <option value="d30">30 ngày gần đây</option>
              </select>
              <p v-if="startdate && enddate">{{ startdate }} - {{ enddate }}</p>
            </div>
          </div>
        </div>
        <div class="page-content">
          <!-- <modal-tracking @track="track"> </modal-tracking> -->
          <div class="w-search">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã tracking"
              @keydown.enter.prevent="searchHandle"
            />
            <div class="icon icon-search"></div>
          </div>
          <div class="row mt-24">
            <div class="col-12">
              <div class="row">
                <div class="col-6">
                  <div class="box box-info">
                    <a
                      @click="goListpackage('in-transit')"
                      href="javascript:void(0)"
                    >
                      <div class="w-icon">
                        <i class="icon icon-plane"></i>
                      </div>
                      <p class="title">In-transit</p>
                      <p class="value">{{ numbers.intransit }}</p>
                    </a>
                  </div>
                </div>
                <div class="col-6">
                  <div class="box box-success">
                    <a
                      @click="goListpackage('delivered')"
                      href="javascript:void(0)"
                    >
                      <div class="w-icon">
                        <i class="icon icon-box-tick"></i>
                      </div>
                      <p class="title">Delivered</p>
                      <p class="value">{{ numbers.delivered }}</p>
                    </a>
                  </div>
                </div>
                <div class="col-12 mt-24">
                  <div class="card">
                    <h3 class="card-title">Thống kê đơn hàng</h3>
                    <div class="card-body">
                      <line-chart
                        :chartData="chartData"
                        :options="chartOptions"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--            <div class="col-3 list-actions">-->
            <!--              <div class="card bg-gray">-->
            <!--                <h3 class="card-title">Hoạt động</h3>-->
            <!--                <div class="card-body">-->
            <!--                  <ul class="messages pb-4">-->
            <!--                    <li v-for="item in messages" :key="item.id">-->
            <!--                      <router-link-->
            <!--                        :to="{-->
            <!--                          name: 'package-detail',-->
            <!--                          params: { id: item.package_id },-->
            <!--                        }"-->
            <!--                      >-->
            <!--                        <i class="icon icon-export"></i>-->
            <!--                        <p v-html="item.message"></p>-->
            <!--                      </router-link>-->
            <!--                    </li>-->
            <!--                  </ul>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '../components/LineChart'
import { mapActions, mapState, mapGetters } from 'vuex'
import { FETCH_ANALYTICS } from '../store'
import {
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_PENDING_PICKUP,
  PACKAGE_STATUS_PICKED,
  PACKAGE_STATUS_WAREHOUSE_LABELED,
  PACKAGE_STATUS_WAREHOUSE_INCONTAINER,
  PACKAGE_STATUS_WAREHOUSE_INSHIPMENT,
  PACKAGE_STATUS_INTRANSIT,
  PACKAGE_STATUS_DELIVERED,
  PACKAGE_STATUS_RETURNED,
  PACKAGE_STATUS_CANCELLED,
  PACKAGE_STATUS_WAREHOUSE_EXPORT,
  PACKAGE_STATUS_IMPORT_HUB,
  PACKAGE_STATUS_EXPORT_HUB,
  PACKAGE_STATUS_RESHIP,
} from '../constant'
// import ModalTracking from '../../tracking/components/ModalTracking.vue'

export default {
  name: 'Home',
  components: {
    LineChart,
    // ModalTracking,
  },
  data() {
    return {
      time: 'd14',
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        elements: {
          point: {
            style: 'circle',
            radius: 3,
          },
        },
        legend: {
          display: true,
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
      },
      datavalues: {
        created: [],
        pendingPickup: [],
        intransit: [],
        delivered: [],
        returned: [],
        cancelled: [],
        processing: [],
      },
      numbers: {
        created: 0,
        pendingPickup: 0,
        intransit: 0,
        delivered: 0,
        returned: 0,
        cancelled: 0,
        processing: 0,
      },
    }
  },
  computed: {
    ...mapGetters('home', ['messages']),
    ...mapState('home', {
      analytics: (state) => state.analytics,
    }),
    startdate() {
      const t = new Date()
      t.setDate(t.getDate() - this.numday + 1)

      let m = t.getMonth() + 1
      let d = t.getDate()
      let y = t.getFullYear()
      return `${d > 9 ? d : '0' + d}/${m > 9 ? m : '0' + m}/${y}`
    },
    enddate() {
      const t = new Date()
      let m = t.getMonth() + 1
      let d = t.getDate()
      let y = t.getFullYear()
      return `${d > 9 ? d : '0' + d}/${m > 9 ? m : '0' + m}/${y}`
    },
    numday() {
      const mapdays = { d7: 7, d14: 14, d30: 30 }
      return mapdays[this.time] || 14
    },
    days() {
      const num = this.numday
      const now = new Date()
      const days = []
      for (let i = 0; i < num; i++) {
        let m = now.getMonth() + 1
        let d = now.getDate()
        days[num - i - 1] = `${d > 9 ? d : '0' + d}/${m > 9 ? m : '0' + m}`
        now.setDate(now.getDate() - 1)
      }

      return days
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('home', {
      fetchAnalytics: FETCH_ANALYTICS,
    }),

    async init() {
      this.createBaseData()

      const res = await this.fetchAnalytics()
      if (!res || res.error) {
        this.fillData()
        this.$toast.error(res.message)
        return
      }

      for (const v of this.analytics) {
        const day = this.dateToDay(v.date_time)
        const index = this.days.findIndex((item) => item === day)
        if (index === -1) continue

        let count = parseInt(v.count)

        switch (v.status) {
          case PACKAGE_STATUS_CREATED:
            this.numbers.created += count
            this.datavalues.created[index] += count
            break
          case PACKAGE_STATUS_PENDING_PICKUP:
            this.numbers.pendingPickup += count
            this.datavalues.pendingPickup[index] += count
            break
          case PACKAGE_STATUS_PICKED:
          case PACKAGE_STATUS_WAREHOUSE_LABELED:
          case PACKAGE_STATUS_WAREHOUSE_INCONTAINER:
          case PACKAGE_STATUS_WAREHOUSE_INSHIPMENT:
          case PACKAGE_STATUS_WAREHOUSE_EXPORT:
          case PACKAGE_STATUS_IMPORT_HUB:
          case PACKAGE_STATUS_EXPORT_HUB:
          case PACKAGE_STATUS_INTRANSIT:
          case PACKAGE_STATUS_RESHIP:
            this.numbers.intransit += count
            this.datavalues.intransit[index] += count
            break
          case PACKAGE_STATUS_DELIVERED:
            this.numbers.delivered += count
            this.datavalues.delivered[index] += count
            break
          case PACKAGE_STATUS_RETURNED:
            this.numbers.returned += count
            this.datavalues.returned[index] += count
            break
          case PACKAGE_STATUS_CANCELLED:
            this.numbers.cancelled += count
            this.datavalues.cancelled[index] += count
            break
        }
      }

      this.fillData()
    },

    dateToDay(date) {
      const d = date.substr(-2, 2)
      const m = date.substr(5, 2)
      return `${d}/${m}`
    },

    createBaseData() {
      this.numbers = {
        created: 0,
        pendingPickup: 0,
        intransit: 0,
        delivered: 0,
        returned: 0,
        cancelled: 0,
        processing: 0,
      }

      for (const key in this.datavalues) {
        if (!Object.hasOwnProperty.call(this.datavalues, key)) continue
        this.datavalues[key] = []
        for (let i = 0; i < this.days.length; i++) {
          this.datavalues[key].push(0)
        }
      }
    },

    fillData() {
      this.chartData = {
        labels: this.days,
        datasets: [
          {
            label: 'Giao thành công',
            borderColor: '#48BE78',
            borderWidth: 1,
            backgroundColor: '#F0FFF3',
            data: this.datavalues.delivered,
          },
        ],
      }
    },

    searchHandle(e) {
      let keyword = e.target.value.trim()
      if (keyword == '') return

      this.$router.push({ name: 'list-packages', query: { code: keyword } })
    },

    goListpackage(status) {
      const mapdays = { d7: 7, d14: 14, d30: 30 }
      const num = mapdays[this.time] || 14

      let t = new Date()
      let ed = this.dateformat(t)

      t.setDate(t.getDate() - num + 1)
      let sd = this.dateformat(t)

      this.$router.push({
        name: 'list-packages',
        query: {
          status: status,
          start_date: sd,
          end_date: ed,
        },
      })
    },

    dateformat(dt) {
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()

      return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
    },

    track(codes) {
      this.$store.commit('tracking/setCodes', codes)

      this.$router.push({ name: 'tracking' })
    },
  },
  watch: {
    time() {
      this.init()
    },
  },
}
</script>
