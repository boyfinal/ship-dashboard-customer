<template>
  <div class="pages wallet top-up bill-dashboard">
    <div class="page-content">
      <div class="page-header">
        <div class="container">
          <div class="row info-money">
            <div class="col-4">
              <div class="box balance">
                <img src="@assets/img/walletLg.svg" alt="wallet" />
                <div class="ml-24">
                  <p class="title">Số dư trong ví</p>
                  <p class="money">{{ balance | formatPrice }}</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="box process-money">
                <img src="@assets/img/debit.svg" alt="process-money" />
                <div class="ml-24">
                  <p class="title">Tiền chưa thanh toán</p>
                  <p class="money"
                    >{{ debit | formatPrice }}
                    <span v-if="maxDebitAmoung"
                      >(Tối đa: {{ maxDebitAmoung | formatPrice }})</span
                    ></p
                  >
                  <p v-if="debitDayLeft != null"
                    >Thời gian công nợ còn lại: {{ debitDayLeft }}</p
                  >
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="box holding-money">
                <img src="@assets/img/time.svg" alt="process-money" />
                <div class="ml-24">
                  <p class="title">Tiền chờ xử lý</p>
                  <p class="money">{{ user.holding_money | formatPrice }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-body">
        <div class="container">
          <div class="tab">
            <a
              href="javascript:void(0)"
              @click="setPage('topup')"
              :class="{ deactive: !isTopup, active: isTopup }"
              >Nạp tiền</a
            >
            <a
              href="javascript:void(0)"
              @click="setPage('bill')"
              :class="{ deactive: !isBill, active: isBill }"
              >Quản lý hóa đơn</a
            >
            <a
              href="javascript:void(0)"
              @click="setPage('transaction')"
              :class="{ deactive: !isTransaction, active: isTransaction }"
              >Lịch sử giao dịch</a
            >
            <a
              href="javascript:void(0)"
              @click="setPage('holding')"
              :class="{ deactive: !isHolding, active: isHolding }"
              >Đơn chờ xử lý</a
            >
            <a
              href="javascript:void(0)"
              @click="setPage('rate_currency')"
              :class="{ deactive: !isRateCurrency, active: isRateCurrency }"
              >Tỷ giá</a
            >
          </div>
          <transition name="fade" mode="out-in">
            <wallet v-if="isTopup"></wallet>
            <list-bills v-if="isBill"></list-bills>
            <transaction v-if="isTransaction"></transaction>
            <listHoldings v-if="isHolding"></listHoldings>
            <div class="page-content" v-if="isRateCurrency">
              <div class="superset">
                <iframe
                  style="overflow: hidden; width: 100%; height: 100vh"
                  width="600"
                  height="1500"
                  seamless
                  frameBorder="0"
                  scrolling="yes"
                  :src="supersetLink"
                >
                </iframe>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { GET_USER } from '../../shared/store'
import Wallet from './Topup.vue'
import ListBills from './ListBills.vue'
import Transaction from './Transaction.vue'
import ListHoldings from './ListHoldings.vue'

export default {
  name: 'BillDashboard',
  props: ['topup'],
  components: { Wallet, ListBills, Transaction, ListHoldings },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
    balance() {
      return this.user.balance > 0 ? this.user.balance : 0
    },
    debit() {
      return this.user.balance < 0 ? Math.abs(this.user.balance) : 0
    },
    maxDebitAmoung() {
      return this.user.user_info ? this.user.user_info.debt_max_amount : null
    },
    debitDayLeft() {
      if (
        !this.user.user_info ||
        !this.user.user_info.debt_time ||
        !this.user.user_info.debt_max_day
      ) {
        return null
      }

      let now = new Date().getTime()
      let target = new Date(this.user.user_info.debt_time).getTime()
      let daysLeft =
        this.user.user_info.debt_max_day - (now - target) / (24 * 3600 * 1000)
      let text = '0 ngày'
      if (daysLeft >= 1) {
        text = `${Math.floor(daysLeft)} ngày`
      } else if (daysLeft * 24 >= 1) {
        text = `${Math.floor(daysLeft * 24)} giờ`
      } else if (daysLeft * 24 * 60 >= 1) {
        text = `${Math.floor(daysLeft * 24 * 60)} phút`
      }
      return text
    },
    isTopup() {
      return this.page === 'topup'
    },
    isBill() {
      return this.page === 'bill'
    },
    isTransaction() {
      return this.page === 'transaction'
    },
    isHolding() {
      return this.page === 'holding'
    },
    isRateCurrency() {
      return this.page === 'rate_currency'
    },
    supersetLink() {
      return `https://superset-new.lionnix.com/login?username=view&redirect=${process.env.VUE_APP_SUPERSET_DASHBOARD}`
    },
  },
  data() {
    return {
      page: 'bill',
    }
  },
  created() {
    this.init()
  },
  mounted() {
    if (this.$route.path == '/bill/wallet') {
      this.page = 'transaction'
    }
    if (this.topup) {
      this.page = 'topup'
    }
  },
  methods: {
    ...mapActions('shared', [GET_USER]),

    async init() {
      const user = await this[GET_USER]()

      if (user.error) {
        this.$toast.error('Something went wrong', { duration: 4000 })
        return
      }
    },
    setPage(page) {
      this.page = page
    },
  },
}
</script>
<style>
.superset {
  margin-left: -32px;
  margin-right: -32px;
}
</style>
