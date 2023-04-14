import http from '../../core/services/http'
import { buildQueryString } from '../../core/utils/url'

export default {
  fetchListShipment(payload) {
    return http.get(`/shipments?${buildQueryString(payload)}`)
  },
  fetchCountShipment(payload) {
    return http.get(`/shipments/count?${buildQueryString(payload)}`)
  },
  fetchDetailShipment(id) {
    return http.get(`/shipments/${id}`)
  },
  importFbaPackage(payload) {
    let formData = new FormData()
    formData.append('file', payload.file)
    formData.append('template_id', payload.template_id)
    return http.post(`/packages/import/fba`, formData)
  },
  fetchListShipmentItems({ id, ...params }) {
    return http.get(`/shipments/${id}/items?${buildQueryString(params)}`)
  },
  fetchCountShipmentItems({ id, ...params }) {
    return http.get(`/shipments/${id}/items/count?${buildQueryString(params)}`)
  },
  fulfillShipment(id) {
    return http.post(`/shipments/${id}/fulfill`)
  },
  cancelShipment(id) {
    return http.put(`/shipments/${id}/cancel`)
  },
}
