import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'
import { RESPONSE_TYPE_BLOB } from '@core/constants/http'

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
    formData.append('template_id', payload.template_id)
    return http.post('/packages/import', formData)
  },
  exportPackage(payload) {
    return http.post('/packages/export', payload)
  },
  updatePackage(payload) {
    return http.put(`/packages/${payload.id}`, payload)
  },
  processPackage(payload) {
    return http.post(`/packages/process`, payload)
  },
  fetchBarcodeFile(payload) {
    return http.get(
      `/uploads/file-export/download?${buildQueryString(payload)}`,
      RESPONSE_TYPE_BLOB
    )
  },
  cancelPackages(payload) {
    return http.put(`/packages/cancel`, payload)
  },
  createPackage(payload) {
    return http.post(`/packages/create`, payload)
  },
  pendingPickupPackages(payload) {
    return http.put(`/packages/pending-pickup`, payload)
  },
  validateAddress(payload) {
    return http.post(`/packages/validate-address`, payload)
  },
  fetchPackagesHolding(payload) {
    return http.get(`/packages/holding?${buildQueryString(payload)}`)
  },
  countPackagesHolding(payload) {
    return http.get(`/packages/holding/count?${buildQueryString(payload)}`)
  },
  fetchPackagesReturn(payload) {
    return http.get(`/packages/return?${buildQueryString(payload)}`)
  },
  countPackagesReturn(payload) {
    return http.get(`/packages/return/count?${buildQueryString(payload)}`)
  },
  packageReship({ id, ...payload }) {
    return http.put(`/packages/${id}/reship`, payload)
  },
  fetchPackageProducts(id) {
    return http.get(`/packages/${id}/products`)
  },
  packageReshipEstimateCost({ id, ...payload }) {
    return http.post(`/packages/${id}/reship/estimate-cost`, payload)
  },
}
