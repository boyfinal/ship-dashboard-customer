import api from '../api'

/**
 * Type
 */
export const UPDATE_USER = 'updateUser'
export const LIST_SENDER = 'listSender'
export const COUNT_SENDER = 'countSender'
export const CREATE_SENDER = 'createSender'
export const UPDATE_SENDER = 'updateSender'
/**
 * State
 */
export const state = {
  user: {},
  senders: [],
  count_sender: 0,
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
}
