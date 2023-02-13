import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  create(payload) {
    return http.post(`/orders`, payload)
  },

  import(payload) {
    return http.post(`/orders/import`, payload)
  },

  fetchDetail(id) {
    return http.get(`/orders/${id}`)
  },

  fetchList(payload) {
    return http.get(`/orders?${buildQueryString(payload)}`)
  },

  fetchCount(payload) {
    return http.get(`/orders/count?${buildQueryString(payload)}`)
  },

  fetchListPackages({ id, ...params }) {
    return http.get(`/orders/${id}/packages?${buildQueryString(params)}`)
  },

  fetchCountPackages({ id, ...params }) {
    return http.get(`/orders/${id}/packages/count?${buildQueryString(params)}`)
  },

  export(id) {
    return http.post(`/orders/${id}/export`)
  },

  statics(params) {
    return http.get(`/orders/statics?${buildQueryString(params)}`)
  },

  delete(id) {
    return http.delete(`/orders/${id}`)
  },
}
