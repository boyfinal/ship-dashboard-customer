<template>
  <div class="wallet top-up">
    <div class="page-content">
      <div class="page-body">
        <div class="d-flex jc-sb topup-content">
          <div class="method">
            <a
              href="javascript:void(0)"
              @click="setMethod(topupType)"
              :class="{ deactive: !isTopup, active: isTopup }"
            >
              <inline-svg
                :class="{ hidden: isTopup }"
                :src="require('../../../../src/assets/img/card.svg')"
              >
              </inline-svg>
              <inline-svg
                :class="{ hidden: !isTopup }"
                :src="require('../../../../src/assets/img/card-active.svg')"
              >
              </inline-svg
              >Chuyển khoản
            </a>
            <a
              href="javascript:void(0)"
              @click="setMethod(payoneerType)"
              :class="{ deactive: !isPayoneer, active: isPayoneer }"
            >
              <img
                :class="{ hidden: isPayoneer }"
                src="@assets/img/payoneer.svg"
              />
              <img
                :class="{ hidden: !isPayoneer }"
                src="@assets/img/payoneer-active.svg"
              />
            </a>
            <a
              href="javascript:void(0)"
              @click="setMethod(pingPongType)"
              :class="{ deactive: !isPingPong, active: isPingPong }"
            >
              <inline-svg
                :class="{ hidden: isPingPong }"
                :src="require('../../../../src/assets/img/pingpong.svg')"
              >
              </inline-svg>
              <inline-svg
                :class="{ hidden: !isPingPong }"
                :src="require('../../../../src/assets/img/pingpong-active.svg')"
              ></inline-svg>
            </a>
          </div>
          <transition name="fade" mode="out-in">
            <div class="form-topup" v-if="isTopup" key="a">
              <span class="title">
                Vui lòng chuyển tiền tới số tài khoản dưới đây theo nội dung
                sau:
              </span>
              <div class="card">
                <div class="card-info">
                  <p
                    >Ngân hàng:<br /><span>{{ bank }}</span>
                  </p>
                  <p
                    >Tên chủ thẻ:<br /><span>{{ name }}</span>
                    <copy :value="name"></copy>
                  </p>
                  <p
                    >Số tài khoản:<br /><span>{{ accountNumber }}</span>
                    <copy :value="accountNumber"></copy>
                  </p>
                  <p>
                    Nội dung chuyển khoản:<br />
                    <span>Nap topup {{ topup.id }}</span>
                    <copy :value="`Nap topup ${topup.id}`"></copy>
                  </p>
                </div>

                <div class="swap_money">
                  <div class="money">
                    <label class="title d-flex justify-content-between">
                      <span>Nhập số tiền:</span>
                    </label>
                    <div class="input">
                      <input
                        id="money"
                        @input="onChangeAmount"
                        placeholder="Nhập số tiền"
                        :value="amount"
                      />
                      <span>{{ US_FLAG.name }}</span>
                      <img :src="US_FLAG.icon" alt="flag" class="flag" />
                    </div>
                  </div>
                  <div @click="swapHandle" class="btn-convert">
                    <img src="@assets/img/convert.svg" alt="" />
                  </div>
                  <div class="money">
                    <label class="title">Số tiền tương ứng:</label>
                    <div class="d-flex">
                      <div class="w-price">
                        <span class="price">{{ amountVND }}</span>
                        <copy :value="amountVND" v-if="amountVND"></copy>
                        <span class="currency">{{ VN_FLAG.name }}</span>
                        <img :src="VN_FLAG.icon" alt="flag" class="flag" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="invalid-error" v-if="error == true">
                  {{ errorText }}
                </div>
                <div class="mt-24 btn-exchange">
                  <p-button @click.prevent="handlerRecharge" :loading="loading">
                    Xác nhận
                  </p-button>
                  <div class="info_exchange">
                    <div class="rate_exchange"
                      >Tỷ giá chuyển đổi: 1 USD = {{ currencyRate }} VND</div
                    >
                    <div class="rate_exchange_updated"
                      >Ngày cập nhật:
                      {{ updatedAt | datetime('dd/MM/yyyy') }}</div
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="form-topup" v-else key="b">
              <div class="form-title">
                <p
                  ><span
                    >Vui lòng chuyển tiền tới địa chỉ:
                    <strong v-if="isPayoneer"
                      >trungpq.ftu@gmail.com<copy
                        :value="`trungpq.ftu@gmail.com`"
                      ></copy>
                    </strong>
                    <strong v-if="isPingPong"
                      >tungpk@lionnix.com<copy
                        :value="`tungpk@lionnix.com`"
                      ></copy
                    ></strong> </span
                ></p>
                <p>
                  Copy <strong>Transaction ID</strong> rồi nhập vào ô phía dưới.
                </p>
                <p>Nhấn nút <strong>Xác nhận</strong> để nạp topup.</p>
                <br />
              </div>
              <div class="form-body">
                <div
                  class="transaction-content"
                  style="margin: 0; display: block"
                >
                  <div class="row mb-10">
                    <div class="col-2 lb-trans">Transaction ID:</div>
                    <div class="input-trans col-8">
                      <input
                        type="text"
                        class="form-control"
                        v-model="transactionID"
                        placeholder="Nhập Transaction ID"
                      />
                    </div>
                  </div>
                  <div class="amount row">
                    <div class="col-2 lb-trans">Nhập số tiền:</div>
                    <div class="input col-8">
                      <input
                        id="money"
                        @input="onChangeAmount"
                        placeholder="Nhập số tiền"
                        :value="amount"
                        class="form-control"
                      />
                      <span> USD </span>
                    </div>
                  </div>
                </div>
                <div class="invalid-error" v-if="error == true">
                  {{ errorText }}
                </div>
                <div class="accept d-flex mt-24">
                  <p-button
                    type="primary"
                    @click="handlerCreateTransaction"
                    :loading="loading"
                  >
                    Xác nhận
                  </p-button>
                  <div class="note">
                    <i>
                      Thời gian xử lý khoảng 15 phút. Nếu tiền không được chuyển
                      vào topup sau thời gian này, vui lòng liên hệ bộ phận
                      support của LionBay để được hỗ trợ.</i
                    >
                  </div>
                </div>
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
import {
  CREATE_TOPUP,
  UPDATE_TOPUP,
  CREATE_TRANSACTION,
  FETCH_RATE_EXCHANGE,
  FETCH_TRANSACTION,
} from '../store/index'
import {
  BANK,
  NAME,
  ACCOUNT_NUMBER,
  TransactionLogTypeTopup,
  TransactionLogTypePayoneer,
  TransactionLogTypePingPong,
} from '../constants'
import { formatNumber } from '@core/utils/formatter'
import Copy from '../components/Copy.vue'

export default {
  name: 'Wallet',
  components: { Copy },
  computed: {
    ...mapState('bill', {
      topup: (state) => state.topup,
    }),
    amountVND() {
      if (!this.amount || this.error) return ''
      const amount = +this.amount.replaceAll(',', '')
      if (this.toUSD) {
        return amount / this.USDTOVND
      }
      return formatNumber(Math.round(amount * this.USDTOVND))
    },
    currencyRate() {
      return formatNumber(this.USDTOVND)
    },
    isTopup() {
      return this.method === TransactionLogTypeTopup
    },
    isPayoneer() {
      return this.method === TransactionLogTypePayoneer
    },
    isPingPong() {
      return this.method === TransactionLogTypePingPong
    },
    topupType() {
      return TransactionLogTypeTopup
    },
    payoneerType() {
      return TransactionLogTypePayoneer
    },
    pingPongType() {
      return TransactionLogTypePingPong
    },
  },
  data() {
    return {
      loading: false,
      bank: BANK,
      name: NAME,
      accountNumber: ACCOUNT_NUMBER,
      error: false,
      errorText: '',
      moneyText: '',
      amount: '',
      method: TransactionLogTypeTopup,
      transactionID: '',
      VN_FLAG: { name: 'VND', icon: require('@assets/img/vn.svg') },
      US_FLAG: { name: 'USD', icon: require('@assets/img/us.svg') },
      toUSD: false,
      USDTOVND: 0,
      updatedAt: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('bill', [
      CREATE_TOPUP,
      UPDATE_TOPUP,
      CREATE_TRANSACTION,
      FETCH_RATE_EXCHANGE,
      FETCH_TRANSACTION,
    ]),

    async init() {
      const [exchange] = await Promise.all([
        this[FETCH_RATE_EXCHANGE](),
        this.createTopup(),
      ])

      if (!exchange || !exchange.success) {
        this.$toast.error('Something went wrong', { duration: 4000 })
        return
      }

      this.USDTOVND = exchange.usdtovnd
      this.updatedAt = new Date()
    },
    swapHandle() {
      let temp = this.VN_FLAG
      this.VN_FLAG = this.US_FLAG
      this.US_FLAG = temp
      this.toUSD = !this.toUSD
    },
    async handlerRecharge() {
      let amount = +this.amount.replaceAll(',', '')
      if (this.loading) return

      this.checkValidAmount()
      if (this.error) return

      if (this.toUSD) {
        const rate = await this[FETCH_RATE_EXCHANGE]()
        if (!rate || !rate.success) {
          this.$toast.error('Something went wrong', { duration: 4000 })
          return
        }

        this.USDTOVND = rate.usdtovnd
        amount = amount / +this.USDTOVND
      }

      if (amount < 1) {
        this.errorText = 'Số tiền nhập tối thiểu 1$!'
        this.error = true
        return
      }

      let params = {
        id: this.topup.id,
        body: { amount },
      }
      this.loading = true
      const result = await this.updateTopup(params)
      this.loading = false

      if (!result || !result.success) {
        this.$toast.error(result.message, { duration: 4000 })
        return
      }

      this.$toast.success('Yêu cầu của bạn đang được xử lý', { duration: 3000 })

      this.init()
      this.error = false
      this.errorText = ''
      this.moneyText = ''
      this.amount = ''
    },

    onChangeAmount(e) {
      this.amount = 0
      let value = e.target.value.trim()
      if (this.toUSD && !this.isPayoneer && !this.isPingPong) {
        value = value.replace(/[.|,]/g, '').replace(/^0+/, '')
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      value = value.replace(/,/g, '').replace(/^0+/, '')
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.amount = value

      this.checkValidAmount()
    },

    checkValidAmount() {
      if (this.amount == '') {
        this.error = true
        this.errorText = 'Số tiền không được để trống!'
        return
      }

      if (!/^[0-9.,]+$/.test(this.amount)) {
        this.error = true
        this.errorText = 'Số tiền không hợp lệ!'
        return
      }

      this.error = false
      this.errorText = ''
    },

    setMethod(type) {
      this.method = type
      this.amount = ''
      this.error = false
    },

    async handlerCreateTransaction() {
      let amount = +this.amount.replaceAll(',', '')
      if (this.loading) return
      this.checkValidAmount()
      if (this.error) return
      // const rate = await this[FETCH_RATE_EXCHANGE]()
      // if (!rate || !rate.success) {
      //   this.$toast.error('Something went wrong', { duration: 4000 })
      //   return
      // }
      //
      // this.USDTOVND = rate.usdtovnd
      // amount = amount / +this.USDTOVND

      if (amount < 1) {
        this.errorText = 'Số tiền nhập tối thiểu 1$!'
        this.error = true
        return
      }

      this.loading = true
      let payload = {
        type: this.method,
        transaction_id: this.transactionID,
        amount: Math.trunc(amount * 100) / 100,
      }

      const result = await this[CREATE_TRANSACTION](payload)
      this.loading = false

      if (!result || !result.success) {
        this.$toast.error(result.message, { duration: 4000 })
        return
      }

      this.$toast.success('Yêu cầu của bạn đang được xử lý', { duration: 3000 })
      this.$set(this, 'transactionID', '')
      this.error = false
      this.errorText = ''
      this.moneyText = ''
      this.amount = ''
    },
  },
}
</script>
