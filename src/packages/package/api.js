import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
export default {
  /**
   * fetch package
   * @param payload
   * @return {*}
   */
  fetchPackage(payload) {
    return http.get(`/packages/${payload}`)
  },

  /**
   * fetch list product
   * @param payload
   * @return {*}
   */
  fetchListProduct() {
    return http.get(`/products`)
  },
  /**
   * fetch list service
   * @param payload
   * @return {*}
   */
  fetchListService() {
    return http.get(`/services`)
  },
  fetchListPackages(payload) {
    return http.get(`/packages?${buildQueryString(payload)}`)
  },
  countListPackages(payload) {
    return http.get(`/packages/count?${buildQueryString(payload)}`)
  },
  importPackage(payload) {
    const formData = new FormData()

    formData.append('file', payload.file)
    return http.post('/packages/import', formData)
  },
  exportPackage(payload) {
    return http.post('/packages/export', payload)
  },
  updatePackage(payload) {
    return http.put(`/packages/${payload.id}`, payload)
  },
}
