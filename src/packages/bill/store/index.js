import api from '../api'
export const FETCH_BILL_DETAIL = 'fetchBillDetail'
export const FETCH_BILL_EXTRA = 'fetchBillExtra'
export const FETCH_BILL_REFUND = 'fetchBillRefund'
export const COUNT_FEE_CREATE = 'countFeeCreate'
export const FETCH_FEE_CREATE = 'fetchFeeCreate'
export const COUNT_FEE_EXTRA = 'countFeeExtra'
export const FETCH_FEE_EXTRA = 'fetchFeeExtra'
export const COUNT_FEE_REFUND = 'countFeeRefund'
export const FETCH_FEE_REFUND = 'fetchFeeRefund'
export const FETCH_TRANSACTION = 'fetchTransaction'
export const COUNT_TRANSACTION = 'countTransaction'
export const CREATE_TOPUP = 'createTopup'
export const UPDATE_TOPUP = 'updateTopup'
export const COUNT_BILLS = 'countBills'
export const FETCH_BILL_LIST = 'fetchBillList'
export const CREATE_TRANSACTION = 'createTransaction'
export const FETCH_RATE_EXCHANGE = 'fetchRateExchange'
export const FETCH_RATE_EXCHANGE_UPDATE = 'fetchRateExchangeUpdate'
export const FETCH_PACKAGES = 'fetchPackages'
export const EXPORT_BILL = 'exportBill'
export const EXPORT_BILLS = 'exportBills'

export const state = {
  bill: {},
  feeEdit: [],
  feeCreate: [],
  feeExtra: [],
  feeRefund: [],
  countEdit: 0,
  countCreate: 0,
  countExtra: 0,
  countRefund: 0,
  transactions: [],
  count: 0,
  balance: 0.0,
  process_money: 0.0,
  topup: {},
  countBills: 0,
  bills: [],
  rateExchage: 0,
  updatedAt: '',
}

export const mutations = {
  [FETCH_BILL_DETAIL]: (state, payload) => {
    state.bill = payload
  },
  [COUNT_FEE_CREATE]: (state, payload) => {
    state.countCreate = payload
  },
  [FETCH_FEE_CREATE]: (state, payload) => {
    state.feeCreate = payload
  },
  [COUNT_FEE_EXTRA]: (state, payload) => {
    state.countExtra = payload
  },
  [FETCH_FEE_EXTRA]: (state, payload) => {
    state.feeExtra = payload
  },
  [COUNT_FEE_REFUND]: (state, payload) => {
    state.countRefund = payload
  },
  [FETCH_FEE_REFUND]: (state, payload) => {
    state.feeRefund = payload
  },
  [FETCH_TRANSACTION]: (state, payload) => {
    state.balance = payload.balance
    state.process_money = payload.process_money
    state.transactions = payload.transactions
  },
  [COUNT_TRANSACTION]: (state, payload) => {
    state.count = payload
  },
  [CREATE_TOPUP]: (state, payload) => {
    state.topup = payload
  },
  [FETCH_BILL_LIST]: (state, payload) => {
    state.bills = payload
  },
  [COUNT_BILLS]: (state, payload) => {
    state.countBills = payload
  },
  [FETCH_RATE_EXCHANGE]: (state, payload) => {
    state.rateExchange = payload
  },
  [FETCH_RATE_EXCHANGE_UPDATE]: (state, payload) => {
    state.updated_at = payload
  },
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async fetchBillList({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchBillList(payload),
      api.fetchBillCount(payload),
    ])
    if (!list.bills || !count) {
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_BILL_LIST, list.bills)
    commit(COUNT_BILLS, count.count)
    return result
  },

  /**
   * Api get bill detail
   * @param {*} payload
   * @returns Promise
   */
  async [FETCH_BILL_DETAIL]({ commit }, payload) {
    const res = await api.fetchBillDetail(payload)
    if (!res || res.error) {
      commit(FETCH_BILL_DETAIL, {})
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_BILL_DETAIL, res.bill)

    return { success: true, bill: res.bill, total: res.total_fee }
  },
  async [FETCH_PACKAGES]({ commit }, payload) {
    const res = await api.fetchBillPackages(payload)
    if (!res || res.error) {
      commit(FETCH_FEE_CREATE, [])
      commit(COUNT_FEE_CREATE, 0)
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_FEE_CREATE, res.packages)
    commit(COUNT_FEE_CREATE, res.count)

    return { success: true }
  },
  async [FETCH_BILL_EXTRA]({ commit }, payload) {
    const res = await api.fetchExtraFee(payload)
    if (!res || res.error) {
      commit(FETCH_FEE_EXTRA, [])
      commit(COUNT_FEE_EXTRA, 0)
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_FEE_EXTRA, res.fees)
    commit(COUNT_FEE_EXTRA, res.count)

    return { success: true }
  },
  async fetchBillRefund({ commit }, payload) {
    const res = await api.fetchExtraFee(payload)
    if (!res || res.error) {
      commit(FETCH_FEE_REFUND, [])
      commit(COUNT_FEE_REFUND, 0)

      return { success: false, message: res.errorMessage || '' }
    }
    commit(FETCH_FEE_REFUND, res.fees)
    commit(COUNT_FEE_REFUND, res.count)

    return { success: true }
  },
  async fetchRateExchange({ commit }) {
    const res = await api.fetchRateExchange()
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(FETCH_RATE_EXCHANGE, res.usd_to_vnd)
    commit(FETCH_RATE_EXCHANGE_UPDATE, res.updated_at)

    return {
      success: true,
      usdtovnd: res.usd_to_vnd,
      updated_at: res.updated_at,
    }
  },
  async [FETCH_TRANSACTION]({ commit }, payload) {
    const [res, count] = await Promise.all([
      api.fetchTransactions(payload),
      api.countTransactions(payload),
    ])
    if (!res || res.error || count.error) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_TRANSACTION, res)
    commit(COUNT_TRANSACTION, count.count)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async createTopup({ commit }, payload) {
    const res = await api.createTopup(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }

    commit(CREATE_TOPUP, res.topup)

    return { success: true }
  },

  // eslint-disable-next-line
  async updateTopup({ commit }, payload) {
    const response = await api.updateTopup(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  // eslint-disable-next-line
  async [CREATE_TRANSACTION]({ commit }, payload) {
    const response = await api.createTransaction(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_BILL]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportBill(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.download
    }

    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [EXPORT_BILLS]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportBills(payload)

    if (response.error || response.message) {
      result = {
        success: false,
        message: response.errorMessage || response.error || response.message,
      }
    } else {
      result.url = response.download
    }

    return result
  },
}
