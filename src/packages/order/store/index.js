import api from '../api'

export const CREATE_ORDER = 'createOrder'
export const FETCH_LIST_ORDERS = 'fetchListOrders'
export const FETCH_COUNT_ORDERS = 'fetchCountOrders'
export const FETCH_DETAIL_ORDER = 'fetchDetailOrder'
export const FETCH_LIST_ORDER_PACKAGES = 'fetchListOrderPackages'
export const FETCH_COUNT_ORDER_PACKAGES = 'fetchCountOrderPackage'
export const IMPORT_ORDER = 'importOrders'
export const EXPORT_ORDER = 'exportOrders'
export const FETCH_ORDER_STATICS = 'fetchOrderStatics'
export const DELETE_ORDER = 'deleteOrder'

/**
 * State
 */
export const state = {
  order: {},
  orders: [],
  count: 0,
  countPackages: 0,
  packages: [],
  statics: {},
}

/**
 * Mutation
 */
export const mutations = {
  [FETCH_LIST_ORDERS]: (state, payload) => {
    state.orders = payload
  },
  [FETCH_COUNT_ORDERS]: (state, payload) => {
    state.count = payload
  },
  [FETCH_DETAIL_ORDER]: (state, payload) => {
    state.order = payload
  },
  [FETCH_LIST_ORDER_PACKAGES]: (state, payload) => {
    state.packages = payload
  },
  [FETCH_COUNT_ORDER_PACKAGES]: (state, payload) => {
    state.countPackages = payload
  },
  [FETCH_ORDER_STATICS]: (state, payload) => {
    state.statics = payload
  },
}

export const actions = {
  async [FETCH_DETAIL_ORDER]({ commit }, payload) {
    const res = await api.fetchDetail(payload)
    if (!res || res.error) {
      commit(FETCH_DETAIL_ORDER, {})
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_DETAIL_ORDER, res.order)
    return { error: false }
  },

  async [FETCH_LIST_ORDERS]({ commit }, payload) {
    const res = await api.fetchList(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_ORDERS, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_ORDERS, res.orders)
    return { error: false }
  },

  async [FETCH_COUNT_ORDERS]({ commit }, payload) {
    const res = await api.fetchCount(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_ORDERS, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_COUNT_ORDERS, res.count)
    return { error: false }
  },

  async [FETCH_LIST_ORDER_PACKAGES]({ commit }, payload) {
    const res = await api.fetchListPackages(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_ORDER_PACKAGES, [])
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_ORDER_PACKAGES, res.packages)
    return { error: false }
  },

  async [FETCH_COUNT_ORDER_PACKAGES]({ commit }, payload) {
    const res = await api.fetchCountPackages(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_ORDER_PACKAGES, 0)
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_COUNT_ORDER_PACKAGES, res.count)
    return { error: false }
  },

  // eslint-disable-next-line
  async [IMPORT_ORDER]({ commit }, payload) {
    const res = await api.import(payload)
    if (!res || res.error) {
      return { ...res, error: true, message: res.errorMessage || '' }
    }

    return { ...res, error: false }
  },

  // eslint-disable-next-line
  async [EXPORT_ORDER]({ commit }, payload) {
    const res = await api.export(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { ...res, error: false }
  },

  async [FETCH_ORDER_STATICS]({ commit }, { search, start_date, end_date }) {
    const res = await api.statics({ search, start_date, end_date })
    if (!res || res.error) {
      commit(FETCH_ORDER_STATICS, {})
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_ORDER_STATICS, res.statics)
    return { ...res, error: false }
  },

  // eslint-disable-next-line
  async [DELETE_ORDER]({ commit }, id) {
    const res = await api.delete(id)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { ...res, error: false }
  },
}
