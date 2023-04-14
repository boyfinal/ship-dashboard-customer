import api from '../api'

export const FETCH_LIST_SHIPMENTS = 'fetchListShipments'
export const FETCH_COUNT_SHIPMENTS = 'fetchCountShipments'
export const FETCH_DETAIL_SHIPMENTS = 'fetchDetailShipments'
export const IMPORT_PACKAGE_FBA = 'importPackageFba'
export const FETCH_LIST_SHIPMENT_ITEMS = 'fetchListShipmentItems'
export const FETCH_COUNT_SHIPMENT_ITEMS = 'fetchCountShipmentItems'
export const SET_TOTAL_AMOUNT = 'setTotalAmount'
export const FULFILL_SHIPMENT = 'fulfillShipment'
export const CANCEL_SHIPMENT = 'cancelShipment'

export const state = {
  shipment: {},
  shipments: [],
  total_amount: 0,
  count: 0,
  items: [],
  items_count: 0,
}

export const mutations = {
  [FETCH_LIST_SHIPMENTS]: (state, payload) => {
    state.shipments = payload || []
  },
  [FETCH_COUNT_SHIPMENTS]: (state, payload) => {
    state.count = payload || 0
  },
  [FETCH_DETAIL_SHIPMENTS]: (state, payload) => {
    state.shipment = payload || {}
  },
  [SET_TOTAL_AMOUNT]: (state, payload) => {
    state.total_amount = payload || 0
  },
  [FETCH_LIST_SHIPMENT_ITEMS]: (state, payload) => {
    state.items = payload || {}
  },
  [FETCH_COUNT_SHIPMENT_ITEMS]: (state, payload) => {
    state.items_count = payload || 0
  },
}

export const actions = {
  async [FETCH_LIST_SHIPMENTS]({ commit }, payload) {
    const res = await api.fetchListShipment(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_SHIPMENTS, [])
      return { error: true, message: res.errorMessage }
    }

    commit(FETCH_LIST_SHIPMENTS, res.shipments)
    return { error: false }
  },
  async [FETCH_COUNT_SHIPMENTS]({ commit }, payload) {
    const res = await api.fetchCountShipment(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_SHIPMENTS, 0)
      return { error: true, message: res.errorMessage }
    }

    commit(FETCH_COUNT_SHIPMENTS, res.count)
    return { error: false }
  },
  async [FETCH_DETAIL_SHIPMENTS]({ commit }, payload) {
    const res = await api.fetchDetailShipment(payload)
    if (!res || res.error) {
      commit(SET_TOTAL_AMOUNT, 0)
      commit(FETCH_DETAIL_SHIPMENTS, {})
      return { error: true, message: res.errorMessage }
    }

    commit(SET_TOTAL_AMOUNT, res.total_amount)
    commit(FETCH_DETAIL_SHIPMENTS, res.shipment)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async [IMPORT_PACKAGE_FBA]({ commit }, payload) {
    const response = await api.importFbaPackage(payload)

    if (
      response &&
      typeof response.errors !== 'undefined' &&
      typeof response.total !== 'undefined' &&
      (response.errors.length || response.total > 0)
    ) {
      return {
        success: true,
        ...response,
      }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  async [FETCH_LIST_SHIPMENT_ITEMS]({ commit }, payload) {
    const res = await api.fetchListShipmentItems(payload)
    if (!res || res.error) {
      commit(FETCH_LIST_SHIPMENT_ITEMS, [])
      return { error: true, message: res.errorMessage }
    }

    commit(FETCH_LIST_SHIPMENT_ITEMS, res.items)
    return { error: false }
  },
  async [FETCH_COUNT_SHIPMENT_ITEMS]({ commit }, payload) {
    const res = await api.fetchCountShipmentItems(payload)
    if (!res || res.error) {
      commit(FETCH_COUNT_SHIPMENT_ITEMS, 0)
      return { error: true, message: res.errorMessage }
    }

    commit(FETCH_COUNT_SHIPMENT_ITEMS, res.count)
    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [FULFILL_SHIPMENT]({ commit }, id) {
    const res = await api.fulfillShipment(id)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false }
  },

  // eslint-disable-next-line no-unused-vars
  async [CANCEL_SHIPMENT]({ commit }, id) {
    const res = await api.cancelShipment(id)

    if (!res || res.error) {
      return { error: true, message: res.errorMessage }
    }

    return { error: false }
  },
}
