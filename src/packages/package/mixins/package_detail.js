import { isEmpty } from '@/core/utils/common'
import {
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN,
} from '../constants'

export default {
  computed: {
    isEmpty() {
      return isEmpty(this.current)
    },
    current() {
      return this.package_detail.package || {}
    },
    hasCancelPackage() {
      const { status_string } = this.current
      return (
        status_string === PACKAGE_STATUS_CREATED_TEXT ||
        status_string === PACKAGE_STATUS_PENDING_PICKUP_TEXT
      )
    },
    hasEditPackage() {
      const { status_string } = this.current
      return status_string === PACKAGE_STATUS_CREATED_TEXT
    },
    hasMakeTracking() {
      const { status_string } = this.current
      return status_string === PACKAGE_STATUS_CREATED_TEXT
    },
    isCreatedStatus() {
      const { status_string } = this.current
      return status_string === PACKAGE_STATUS_CREATED_TEXT
    },
    hasReshipPackage() {
      const { status_string, alert } = this.current
      return (
        status_string === PACKAGE_STATUS_PENDING_PICKUP_TEXT &&
        alert == PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN
      )
    },
    linkTrackInfo() {
      const { tracking_number } = this.current
      return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${tracking_number}`
    },
  },
}
