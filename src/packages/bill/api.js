import http from '@core/services/http'
import { buildQueryString } from '@core/utils/url'

export default {
  /**
   * get detail bill
   * @param payload
   * @return {*}
   */
  fetchBillDetail({ code }) {
    return http.get(`/bills/${code}`)
  },

  /**
   * get list bill
   * @param payload
   * @return {*}
   */
  fetchBillList(payload) {
    return http.get(`/bills/list?${buildQueryString(payload)}`)
  },
  /**
   * get detail bill
   * @param payload
   * @return {*}
   */
  fetchBillCount(payload) {
    return http.get(`/bills/count?${buildQueryString(payload)}`)
  },

  /**
   * get extra fee
   * @param payload
   * @return {*}
   */
  fetchExtraFee(payload) {
    const code = payload.code
    delete payload.code

    return http.get(`/bills/${code}/fees?${buildQueryString(payload)}`)
  },
  fetchBillPackages(payload) {
    const code = payload.code
    delete payload.code

    return http.get(`/bills/${code}/packages?${buildQueryString(payload)}`)
  },
  fetchTransactions(payload) {
    return http.get(`/transactions?${buildQueryString(payload)}`)
  },
  countTransactions(payload) {
    return http.get(`/transactions/count?${buildQueryString(payload)}`)
  },
  createTopup() {
    return http.post('/transactions/top-up')
  },
  updateTopup(payload) {
    return http.post(`/transactions/top-up/update/${payload.id}`, payload.body)
  },
  createTransaction(payload) {
    return http.post(`/transactions`, payload)
  },
  /**
   * get rate exchange
   * @return {*}
   */
  fetchRateExchange() {
    return http.get(`/transactions/rate-exchange`)
  },
  exportBill(payload) {
    return http.get(`/bills/invoice/${payload.code}`)
  },
  exportBills(payload) {
    return http.post(`/bills/invoices`, payload)
  },
}
