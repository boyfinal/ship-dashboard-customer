<template>
  <div class="pages">
    <div class="container">
      <div class="d-flex t-services mb-20">
        <button
          class="btn"
          v-for="service in services"
          :key="service.id"
          :disabled="!service.prices.length"
          :class="{ active: service.id == filter.service }"
          @click="switchServiceHandle(service.id)"
        >
          {{ service.name }}
        </button>
      </div>
      <div class="page-content" style="margin-bottom: 50px;">
        <div class="card pb-20">
          <div class="card-body">
            <VclTable v-if="isLoading"></VclTable>
            <template v-else-if="prices.length">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th width="150">DỊCH VỤ</th>
                      <th width="200">CÂN NẶNG (GRAM)</th>
                      <th width="100">GIÁ ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in prices" :key="i">
                      <td>{{ item.name }}</td>
                      <td>{{ item.weight_text }}</td>
                      <td>{{ item.price }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { cloneDeep } from '../../../core/utils'
import { FETCH_LIST_SERVICES } from '../store'

export default {
  name: 'Prices',
  computed: {
    ...mapState('setting', {
      services: (state) => state.services,
    }),
    displayServices() {
      return (this.services || []).filter(
        (item) => item.prices && item.prices.length
      )
    },
    prices() {
      const service = this.services.find(({ id }) => id == this.filter.service)
      if (!service) return []
      const { name } = service
      const prices = cloneDeep(service.prices || []).sort(
        (a, b) => a.weight - b.weight
      )
      const n = prices.length
      for (let i = 0; i < n; i++) {
        const preWeight = i > 0 ? prices[i - 1].weight || 0 : 0
        const weight = parseInt(prices[i].weight || 0)
        prices[i].weight_text = i == 0 ? `<${weight}` : `${preWeight}-${weight}`
        prices[i].name = name
      }

      return prices
    },
  },
  data() {
    return {
      isLoading: false,
      filter: {
        service: 0,
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('setting', {
      fetchServices: FETCH_LIST_SERVICES,
    }),

    async init() {
      this.isLoading = true
      const res = await this.fetchServices({ has_price: 'yes' })
      this.isLoading = false

      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      if (this.services.length > 0) {
        this.filter.service = this.services[0].id
      }
    },

    switchServiceHandle(id) {
      this.filter.service = id
    },
  },
}
</script>
<style lang="scss">
.t-services {
  .btn {
    border: 1px solid #ddd;

    + .btn {
      margin-left: 15px;
    }

    &.active {
      color: #fff;
      background: #00b4c3;
      border-color: #00b4c3;
      cursor: initial;
    }
  }
}
</style>
