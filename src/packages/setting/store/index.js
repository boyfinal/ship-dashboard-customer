import api from '../api'

/**
 * Type
 */
export const UPDATE_USER = 'updateUser'
export const LIST_SENDER = 'listSender'
export const COUNT_SENDER = 'countSender'
export const CREATE_SENDER = 'createSender'
export const UPDATE_SENDER = 'updateSender'
export const GET_SENDER = 'getSender'
export const GET_USER_TOKEN = 'getUserToken'
export const RESET_USER_TOKEN = 'resetUserToken'
export const SAVE_SETTING_WEBHOOK = 'saveSettingWebhook'
export const FETCH_SETTING_WEBHOOK = 'fetchSettingWebhook'

export const UPLOAD_TEMPLATE_FILE = 'uploadTemplateFile'
export const CREATE_TEMPLATE_IMPORT_ORDER = 'createTempateImportOrder'
export const FETCH_IMPORT_ORDER_TEMPLATES = 'fetchImportOrderTemplates'
export const FETCH_TEMPLATES = 'fetchTemplates'
export const COUNT_TEMPLATES = 'countTemplates'
export const DELETE_TEMPLATES = 'deleteTemplates'
export const UPDATE_IMPORT_ORDER_TEMPLATE = 'updateImportOrderTemplate'
export const DOWNLOAD_TEMPLATE_FILE = 'downloadTemplateFile'

export const GENERATE_PREVIEW_LABEL = 'generatePreviewLabel'
export const FETCH_SETTING_LABEL = 'fetchSettingLabel'
export const SAVE_SETTING_LABEL = 'saveSettingLabel'

export const LIST_PRODUCT = 'listProduct'
export const COUNT_PRODUCT = 'countProduct'
export const CREATE_PRODUCT = 'createProduct'
export const UPDATE_PRODUCT = 'updateProduct'
export const DELETE_PRODUCT = 'deleteProduct'

export const FETCH_LIST_SERVICES = 'fetchServices'

/**
 * State
 */
export const state = {
  user: {},
  senders: [],
  count_sender: 0,
  user_token: '',
  webhook_url: '',
  templates: [],
  count: 0,
  products: [],
  count_product: 0,
  services: [],
}

/**
 * Getters
 */
export const getters = {
  [GET_SENDER](state) {
    let senders = state.senders.map((item) => {
      return { sender_id: item.id, name: item.name }
    })
    return senders
  },
}
/**
 * Mutation
 */
export const mutations = {
  [UPDATE_USER]: (state, payload) => {
    state.user = payload
  },
  [LIST_SENDER]: (state, payload) => {
    state.senders = payload
  },
  [COUNT_SENDER]: (state, payload) => {
    state.count_sender = payload
  },
  [GET_USER_TOKEN]: (state, payload) => {
    state.user_token = payload
  },
  [FETCH_SETTING_WEBHOOK]: (state, payload) => {
    state.webhook_url = payload
  },
  [FETCH_TEMPLATES]: (state, payload) => {
    state.templates = payload
  },
  [COUNT_TEMPLATES]: (state, payload) => {
    state.count = payload
  },
  [LIST_PRODUCT]: (state, payload) => {
    state.products = payload
  },
  [COUNT_PRODUCT]: (state, payload) => {
    state.count_product = payload
  },
  [FETCH_LIST_SERVICES]: (state, payload) => {
    state.services = payload
  },
}

/**
 * Actions
 */
export const actions = {
  // eslint-disable-next-line no-unused-vars
  async updateUser({ commit }, payload) {
    const res = await api.updateUser(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    return { error: false }
  },

  async listSender({ commit }, payload) {
    let success = true
    let message = ''

    let [list, count] = await Promise.all([
      api.listSender(payload),
      api.countSenders(payload),
    ])
    if (!list || list.error || !count) {
      list = []
      count = 0
      success = false
      message = list.errorMessage || ''
    }

    commit(LIST_SENDER, list.senders)
    commit(COUNT_SENDER, count.count)
    return { success, message, items: list.designs }
  },

  /**
   * Create sender
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async createSender({ commit }, payload) {
    const response = await api.createSender(payload.body)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  /**
   * Update sender
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async updateSender({ commit }, payload) {
    const response = await api.updateSender(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  /**
   * Get user token
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async getUserToken({ commit }, payload) {
    const response = await api.getUserToken(payload)
    if (response && response.token) {
      commit(GET_USER_TOKEN, response.token)
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  /**
   * Get user token
   * @param commit
   * @param payload
   */
  // eslint-disable-next-line
  async resetUserToken({ commit }, payload) {
    const response = await api.resetUserToken(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  /**
   * Fetch design list
   * @param commit
   * @param payload
   * @return {Promise<{success: boolean, message: string, items: (Array)}>}
   */
  // eslint-disable-next-line no-unused-vars
  async uploadTemplateFile({ commit }, payload) {
    let result = { success: true }
    let response = await api.uploadTemplateFile(payload)

    if (!response || response.error) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    result = { ...result, ...response }
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async createTempateImportOrder({ commit }, payload) {
    let result = { success: true }
    let response = await api.createTemplateImportOrder(payload)

    if (!response || response.error) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },

  async [FETCH_IMPORT_ORDER_TEMPLATES]({ commit }, payload) {
    let result = { success: true }
    let [list, count] = await Promise.all([
      api.fetchListTemplates(payload),
      api.countListTemplates(payload),
    ])

    if (!list.templates || !count) {
      list.templates = []
      count = { count: 0 }
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }

    commit(FETCH_TEMPLATES, list.templates)
    commit(COUNT_TEMPLATES, count.count)
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [DELETE_TEMPLATES]({ commit }, payload) {
    let result = { success: true }
    let response = await api.deleteTemplates(payload)

    if (!response || response.error) {
      result = {
        success: false,
        message: response.errorMessage || '',
      }
    }
    return result
  },
  // eslint-disable-next-line no-unused-vars
  async [UPDATE_IMPORT_ORDER_TEMPLATE]({ commit }, payload) {
    const id = payload.id
    delete payload.id
    const res = await api.updateTemplate(id, payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    return { success: true }
  },

  // eslint-disable-next-line no-unused-vars
  async [DOWNLOAD_TEMPLATE_FILE]({ commit }, payload) {
    let result = { success: true }
    let response = await api.downloadTemplateFile(payload)
    if (!response || response.error) {
      return {
        success: false,
        message: response.errorMessage || '',
      }
    }
    result.blob = response
    return result
  },

  // eslint-disable-next-line no-unused-vars
  async [GENERATE_PREVIEW_LABEL]({ commit }, payload) {
    const res = await api.generatePreviewLabel(payload)
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    return { success: true, url: res.url }
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_SETTING_LABEL]({ commit }) {
    let res = await api.fetchSettingLabel()
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    return {
      success: true,
      setting: res.setting,
    }
  },

  // eslint-disable-next-line
  async [SAVE_SETTING_LABEL]({ commit }, payload) {
    const response = await api.saveSettingLabel(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  // eslint-disable-next-line no-unused-vars
  async [FETCH_SETTING_WEBHOOK]({ commit }) {
    let res = await api.fetchSettingWebhook()
    if (!res || res.error) {
      return { success: false, message: res.errorMessage || '' }
    }
    commit(FETCH_SETTING_WEBHOOK, res.setting.value)
    return {
      success: true,
    }
  },

  // eslint-disable-next-line
  async [SAVE_SETTING_WEBHOOK]({ commit }, payload) {
    const response = await api.saveSettingWebhook(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  async listProduct({ commit }, payload) {
    let result = { success: true }

    let [list, count] = await Promise.all([
      api.fetchListProducts(payload),
      api.countListProducts(payload),
    ])
    if (!list || list.error || !count) {
      list = []
      count = 0
      result = {
        success: false,
        message: list.errorMessage || '',
      }
    }
    commit(LIST_PRODUCT, list.products)
    commit(COUNT_PRODUCT, count.count)
    return result
  },

  // eslint-disable-next-line
  async createProduct({ commit }, payload) {
    const response = await api.createProduct(payload)

    if (response && response.product) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  // eslint-disable-next-line
  async updateProduct({ commit }, payload) {
    const response = await api.updateProduct(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  // eslint-disable-next-line
  async deleteProduct({ commit }, payload) {
    const response = await api.deleteProduct(payload)

    if (response && response.success) {
      return { success: true }
    }

    return {
      success: false,
      message: response.errorMessage || '',
    }
  },

  async [FETCH_LIST_SERVICES]({ commit }, payload) {
    commit(FETCH_LIST_SERVICES, [])
    const res = await api.fetchServices(payload)
    if (!res || res.error) {
      return { error: true, message: res.errorMessage || '' }
    }

    commit(FETCH_LIST_SERVICES, res.services)
    return { error: false }
  },
}
