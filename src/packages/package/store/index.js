import api from '../api'

/**
 * Type
 */
export const FETCH_PACKAGE_DETAIL = 'fetchPackage'

export const FETCH_LIST_PACKAGES = 'fetchListPackages'
export const COUNT_LIST_PACKAGES = 'countListPackages'
export const FETCH_LIST_PRODUCTS = 'fetchListProducts'
export const FETCH_LIST_SERVICE = 'fetchListService'
export const IMPORT_PACKAGE = 'importPackage'
export const UPDATE_PACKAGE = 'updatePackage'
export const PROCESS_PACKAGE = 'processPackage'
export const CANCEL_PACKAGES = 'cancelPackages'
export const PENDING_PICKUP_PACKAGES = 'pendingPickupPackages'

export const EXPORT_PACKAGE = 'exportPackage'
export const GET_SERVICE = 'getService'
export const CREATE_PACKAGE = 'createPackage'
export const VALIDATE_ADDRESS = 'validateAddress'

export const SET_LOADING = 'setLoading'

export const FETCH_PACKAGES_HOLDING = 'fetchPackagesHolding'
export const COUNT_PACKAGES_HOLDING = 'countPackagesHolding'

export const FETCH_PACKAGES_RETURN = 'fetchPackagesReturn'
export const COUNT_PACKAGES_RETURN = 'countPackagesReturn'

export const PACKAGE_RESHIP = 'packageReship'
export const PACKAGE_RESHIP_ESTIMATE_COST = 'packageReshipEstimateCost'
export const FETCH_PACKAGE_PRODUCTS = 'fetchPackageProducts'

/**
 * State
 */
export const state = {
  package_detail: {
    package: {},
    deliver_logs: [],
    price: 0.0,
    extra_fee: [],
    audit_logs: [],
  },
  packages: [],
  countPackages: 0,
  count_status: [],
  products: [],
  service: [],
  isLoading: false,
  package_holding: [],
  count_package_holding: 0,
  package_returns: [],
  count_package_return: 0,
  day: 0,
  package_products: [],
}
/**
 * Getters
 */
export const getters = {
  [GET_SERVICE](state) {
    let sv = state.service.map((item) => {
      return { id: item.id, name: item.name, code: item.code }
    })
    return sv
  },
}
/**
 * Mutation
 */
export const mutations = {
  [FETCH_PACKAGE_DETAIL]: (state, payload) => {
    state.package_detail = payload
  },
  [FETCH_LIST_PACKAGES]: (state, payload) => {
    state.packages = payload
  },
  [FETCH_LIST_PRODUCTS]: (state, payload) => {
    state.products = payload
  },
  [FETCH_LIST_SERVICE]: (state, payload) => {
    state.service = payload
  },
  [COUNT_LIST_PACKAGES]: (state, payload) => {
    state.countPackages = payload.count
    state.count_status = payload.status_count
  },
  [SET_LOADING]: (state, payload) => {
    state.isLoading = payload
  },
  [FETCH_PACKAGES_HOLDING]: (state, payload) => {
    state.package_holding = payload.package_holding
    state.day = payload.day
  },
  [COUNT_PACKAGES_HOLDING]: (state, payload) => {
    state.count_package_holding = payload.count
  },
  [FETCH_PACKAGES_RETURN]: (state, payload) => {
    state.package_returns = payload.packages
  },
  [COUNT_PACKAGES_RETURN]: (state, payload) => {
    state.count_package_return = payload.count
  },
  [FETCH_PACKAGE_PRODUCTS]: (state, payload) => {
    state.package_products = payload
  },
}

/**
 * Action
 */

export const actions = {
  async fetchPackage({ commit }, payload) {
    let result = { success: true }
    const res = await api.fetchPackage(payload)

    if (!res || res.error) {
      result = {
        success: false,
        message: res.errorMessage || '',
      }
    }

    commit(FETCH_PACKAGE_DETAIL, res)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListPackages({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListPackages(payload),
      api.countListPackages(payload),
    ])
    if (!list.packages || !count) {
      list.packages = []
      count = { count: 0, status_count: [] }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }

    commit(FETCH_LIST_PACKAGES, list.packages)
    commit(COUNT_LIST_PACKAGES, count)
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListProducts({ commit }, payload) {
    const res = await api.fetchListProduct()
    if (!res.products) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_LIST_PRODUCTS, res.products)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async fetchListService({ commit }, payload) {
    const res = await api.fetchListService()
    if (!res.services) {
      return { error: true, message: res.errorMessage || '' }
    }
    commit(FETCH_LIST_SERVICE, res.services)
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async updatePackage({ commit }, payload) {
    const res = await api.updatePackage(payload)
    if (!res || (!res.success && !res.package)) {
      return { error: true, message: res.errorMessage || '' }
    }
    return { error: false }
  },
  // eslint-disable-next-line no-unused-vars
  async [IMPORT_PACKAGE]({ commit }, payload) {
    const response = await api.importPackage(payload)

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
  // eslint-disable-next-line no-unused-vars
  async [EXPORT_PACKAGE]({ commit }, payload) {
    let result = { success: true }
    const response = await api.exportPackage(payload)

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
  async processPackage({ commit }, payload) {
    let result = { success: true }
    const res = await api.processPackage(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return { ...result, ...res }
  },

  // eslint-disable-next-line no-unused-vars
  async cancelPackages({ commit }, payload) {
    let result = { success: true }
    const res = await api.cancelPackages(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async pendingPickupPackages({ commit }, payload) {
    let result = { success: true }
    const res = await api.pendingPickupPackages(payload)
    if (res.error || res.message) {
      result = {
        success: false,
        message: res.errorMessage || res.error || res.message,
      }
    }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async createPackage({ commit }, payload) {
    const res = await api.createPackage(payload)
    if (res.error || res.message || !res.id) {
      return {
        success: false,
        message: res.errorMessage || res.error || res.message || '',
      }
    }
    return res
  },

  // eslint-disable-next-line no-unused-vars
  async [VALIDATE_ADDRESS]({ commit }, payload) {
    let result = { success: true }
    const res = await api.validateAddress(payload)
    if (res.error || res.message) {
      return {
        success: false,
        message: res.errorMessage || res.error || res.message || '',
      }
    }
    return result
  },

  [SET_LOADING]({ commit }, payload) {
    commit(SET_LOADING, payload)
  },

  async fetchPackagesHolding({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchPackagesHolding(payload),
      api.countPackagesHolding(payload),
    ])
    if (!list.package_holding || !count) {
      list.package_holding = []
      count = 0
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }

    commit(FETCH_PACKAGES_HOLDING, list)
    commit(COUNT_PACKAGES_HOLDING, count)
    return result
  },

  async fetchPackagesReturn({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchPackagesReturn(payload),
      api.countPackagesReturn(payload),
    ])
    if (!list.packages || !count) {
      list.packages = []
      count = 0
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(FETCH_PACKAGES_RETURN, list)
    commit(COUNT_PACKAGES_RETURN, count)
    return result
  },

  // eslint-disable-next-line
  async [PACKAGE_RESHIP]({ commit }, payload) {
    const res = await api.packageReship(payload)
    if (!res || res.error) {
      return {
        error: true,
        message: res.errorMessage || res.error || res.message || '',
      }
    }

    return { error: false, ...res }
  },

  async [FETCH_PACKAGE_PRODUCTS]({ commit }, payload) {
    const res = await api.fetchPackageProducts(payload)
    if (!res || res.error) {
      commit(FETCH_PACKAGE_PRODUCTS, [])
      return {
        error: true,
        message: res.errorMessage || res.error || res.message || '',
      }
    }

    commit(FETCH_PACKAGE_PRODUCTS, res.products || [])
    return { error: false, ...res }
  },

  // eslint-disable-next-line
  async [PACKAGE_RESHIP_ESTIMATE_COST]({ commit }, payload) {
    const res = await api.packageReshipEstimateCost(payload)
    if (!res || res.error) {
      return {
        error: true,
        message: res.errorMessage || res.error || res.message || '',
      }
    }

    return { error: false, ...res }
  },
}
