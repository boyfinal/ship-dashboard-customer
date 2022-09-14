import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

export default {
  /**
   * update user
   * @param payload
   * @return {*}
   */
  updateUser(payload) {
    return http.put('/users/update', payload)
  },

  /**
   * list senders
   * @param payload
   * @return {*}
   */
  listSender(payload) {
    return http.get(`/users/list-sender?${buildQueryString(payload)}`)
  },

  /**
   * count senders
   * @param payload
   * @return {*}
   */
  countSenders(payload) {
    return http.get(`/users/list-sender/count?${buildQueryString(payload)}`)
  },

  /**
   * Create sender
   * @param payload
   * @return {*}
   */
  createSender(payload) {
    return http.post(`/users/create-sender`, payload)
  },

  /**
   * Update sender
   * @param payload
   * @return {*}
   */
  updateSender(payload) {
    return http.post(`/users/update-sender/${payload.id}`, payload.body)
  },

  /**
   * Get user token
   * @return {*}
   */
  getUserToken() {
    return http.get(`/users/token`)
  },

  /**
   * Reset user token
   * @return {*}
   */
  resetUserToken() {
    return http.put(`/users/token`)
  },

  uploadTemplateFile(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    return http.post(`/templates/upload`, formData)
  },
  createTemplateImportOrder(payload) {
    return http.post(`/templates/create`, payload)
  },
  fetchListTemplates(payload) {
    return http.get(`/templates?${buildQueryString(payload)}`)
  },
  countListTemplates(payload) {
    return http.get(`/templates/count?${buildQueryString(payload)}`)
  },
  deleteTemplates(payload) {
    return http.delete(`/templates`, payload)
  },
  updateTemplate(id, payload) {
    return http.put(`/templates/${id}`, payload)
  },
  downloadTemplateFile(payload) {
    return http.get(`/templates/file?${buildQueryString(payload)}`, {
      type: 'blob',
    })
  },
  fetchSettingLabel() {
    return http.get(`/settings/label`)
  },
  saveSettingLabel(payload) {
    return http.post(`/settings/label`, payload)
  },
  saveSettingWebhook(payload) {
    return http.post(`/settings/webhook`, payload)
  },
  fetchSettingWebhook() {
    return http.get(`/settings/webhook`)
  },
  generatePreviewLabel(payload) {
    return http.post(`/settings/label/preview`, payload)
  },
  fetchLabelFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },

  //api products
  fetchListProducts(payload) {
    return http.get(`/products?${buildQueryString(payload)}`)
  },
  countListProducts(payload) {
    return http.get(`/products/count?${buildQueryString(payload)}`)
  },
  createProduct(payload) {
    return http.post(`/products/create`, payload)
  },
  updateProduct(payload) {
    return http.put(`/products/${payload.id}`, payload)
  },
  deleteProduct(payload) {
    return http.put(`/products/delete/${payload.id}`)
  },
  fetchServices(payload) {
    return http.get(`/services?${buildQueryString(payload)}`)
  },
}
