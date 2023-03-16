export const PACKAGE_STATUS_DEACTIVATE = 0
export const PACKAGE_STATUS_CREATED = 1
export const PACKAGE_STATUS_PENDING_PICKUP = 2
export const PACKAGE_STATUS_RE_PENDING_PICKUP = 3
export const PACKAGE_STATUS_PICKED = 10
export const PACKAGE_STATUS_WAREHOUSE_LABELED = 11
export const PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER = 12
export const PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT = 13
export const PACKAGE_STATUS_WAREHOUSE_EXPORT = 14
export const PACKAGE_STATUS_IN_TRANSIT = 30
export const PACKAGE_STATUS_DELIVERED = 60
export const PACKAGE_STATUS_RETURNED = 40
export const PACKAGE_STATUS_CANCELLED = 50
export const PACKAGE_STATUS_EXPIRED = 70
export const PACKAGE_STATUS_RESHIP = 80
export const PACKAGE_STATUS_UNDELIVERED = 90
export const PACKAGE_STATUS_ARCHIVED = 55

export const PACKAGE_DELIVERY_LOG_TYPE_RESHIP = 80

export const PACKAGE_STATUS_CREATED_TEXT = 'pending'
export const PACKAGE_STATUS_PENDING_PICKUP_TEXT = 'pre-transit'
export const PACKAGE_STATUS_PROCESSING_TEXT = 'processing'
export const PACKAGE_STATUS_IN_TRANSIT_TEXT = 'in-transit'
export const PACKAGE_STATUS_DELIVERED_TEXT = 'delivered'
export const PACKAGE_STATUS_ALERT_TEXT = 'alert'
export const PACKAGE_STATUS_CANCELLED_TEXT = 'canceled'
export const PACKAGE_STATUS_EXPIRED_TEXT = 'expired'
export const PACKAGE_STATUS_UNDELIVERED_TEXT = 'undelivered'
export const PACKAGE_STATUS_RETURN_TEXT = 'return'
export const PACKAGE_STATUS_ARCHIVED_TEXT = 'archived'

export const PACKAGE_ALERT_TYPE_OVER_PRE_TRANSIT = 1
export const PACKAGE_ALERT_TYPE_WAREHOUSE_RETURN = 2
export const PACKAGE_ALERT_TYPE_HUB_RETURN = 3

//audit log
export const PACKAGE_UPDATE_TYPE_RECIPIENT = 1
export const PACKAGE_UPDATE_TYPE_PHONENUMBER = 2
export const PACKAGE_UPDATE_TYPE_ADDRESS = 3
export const PACKAGE_UPDATE_TYPE_ADDRESS2 = 13
export const PACKAGE_UPDATE_TYPE_CITY = 4
export const PACKAGE_UPDATE_TYPE_STATECODE = 5
export const PACKAGE_UPDATE_TYPE_ZIPCODE = 6
export const PACKAGE_UPDATE_TYPE_COUNTRYCODE = 7
export const PACKAGE_UPDATE_TYPE_WEIGHT = 8
export const PACKAGE_UPDATE_TYPE_VOLUME = 9
export const PACKAGE_UPDATE_TYPE_NOTE = 10
export const PACKAGE_UPDATE_TYPE_SERVICE = 11
export const PACKAGE_UPDATE_TYPE_DETAIL = 12
export const PACKAGE_UPDATE_TYPE_LABEL = 13
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_COVID = 14
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OUTSIZE = 15
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXVOLUME = 16
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXWEIGHT = 17
export const PACKAGE_UPDATE_EXTRAFEE_EDIT_ORDER = 19
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_REFUND = 20
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OTHER = 21
export const PACKAGE_CHECK_ADDRESS_TYPE = 22
export const PACKAGE_IGNORE_ADDRESS_TYPE = 23
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_RESHIP = 24
export const PACKAGE_UPDATE_TYPE_ORDER_NUMBER = 25
export const PACKAGE_UPDATE_TYPE_PRODUCT = 26
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_PEAK = 27
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_CANCEL_LABEL = 28
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OVERSIZE = 29
export const PACKAGE_UPDATE_ADRESS_EXCEED_PACKAGE = 31
export const PACKAGE_UPDATE_RETURN_PACKAGE = 32

export const PACKAGE_STATUS_TAB = [
  {
    value: '',
    text: 'All',
  },
  {
    value: PACKAGE_STATUS_CREATED_TEXT,
    text: 'Pending',
  },
  {
    value: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    text: 'Pre-Transit',
  },
  // {
  //   value: PACKAGE_STATUS_PROCESSING_TEXT,
  //   text: 'Processing',
  // },
  {
    value: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    text: 'In-Transit',
  },
  {
    value: PACKAGE_STATUS_DELIVERED_TEXT,
    text: 'Delivered',
  },
  {
    value: PACKAGE_STATUS_ALERT_TEXT,
    text: 'Alert',
  },
  {
    value: PACKAGE_STATUS_CANCELLED_TEXT,
    text: 'Canceled',
  },
  {
    value: PACKAGE_STATUS_EXPIRED_TEXT,
    text: 'Expired',
  },
  {
    value: PACKAGE_STATUS_UNDELIVERED_TEXT,
    text: 'Undelivered',
  },
  {
    value: PACKAGE_STATUS_ARCHIVED_TEXT,
    text: 'Archived',
  },
]

export const MAP_STATUS_CLASS_NAME = {
  [PACKAGE_STATUS_CREATED_TEXT]: {
    text: PACKAGE_STATUS_CREATED_TEXT,
    className: 'await',
  },
  [PACKAGE_STATUS_PENDING_PICKUP_TEXT]: {
    text: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    className: 'pending',
  },
  [PACKAGE_STATUS_PROCESSING_TEXT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_IN_TRANSIT_TEXT]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_DELIVERED_TEXT]: {
    text: PACKAGE_STATUS_DELIVERED_TEXT,
    className: 'success',
  },
  [PACKAGE_STATUS_ALERT_TEXT]: {
    text: PACKAGE_STATUS_ALERT_TEXT,
    className: 'alert',
  },
  [PACKAGE_STATUS_CANCELLED_TEXT]: {
    text: PACKAGE_STATUS_CANCELLED_TEXT,
    className: 'danger',
  },
  [PACKAGE_STATUS_EXPIRED_TEXT]: {
    text: PACKAGE_STATUS_EXPIRED_TEXT,
    className: 'expired',
  },
  [PACKAGE_STATUS_UNDELIVERED_TEXT]: {
    text: PACKAGE_STATUS_UNDELIVERED_TEXT,
    className: 'danger',
  },
  [PACKAGE_STATUS_ARCHIVED_TEXT]: {
    text: PACKAGE_STATUS_ARCHIVED_TEXT,
    className: 'danger',
  },
}

// cSpell:disable
export const CHANGE_PACKAGE_TYPE = {
  [PACKAGE_UPDATE_TYPE_RECIPIENT]: 'Người nhận',
  [PACKAGE_UPDATE_TYPE_PHONENUMBER]: 'Số điện thoại người nhận',
  [PACKAGE_UPDATE_TYPE_ADDRESS]: 'Địa chỉ người nhận',
  [PACKAGE_UPDATE_TYPE_ADDRESS2]: 'Địa chỉ phụ người nhận',
  [PACKAGE_UPDATE_TYPE_CITY]: 'Thành phố',
  [PACKAGE_UPDATE_TYPE_STATECODE]: 'Mã vùng',
  [PACKAGE_UPDATE_TYPE_ZIPCODE]: 'Mã bưu điện',
  [PACKAGE_UPDATE_TYPE_COUNTRYCODE]: 'Mã quốc gia',
  [PACKAGE_UPDATE_TYPE_WEIGHT]: 'Trọng lượng',
  [PACKAGE_UPDATE_TYPE_VOLUME]: 'Kích thước (DxRxC)',
  [PACKAGE_UPDATE_TYPE_NOTE]: 'Yêu cầu khi giao',
  [PACKAGE_UPDATE_TYPE_SERVICE]: 'Dịch vụ',
  [PACKAGE_UPDATE_TYPE_DETAIL]: 'Chi tiết hàng hóa',
  [PACKAGE_UPDATE_TYPE_LABEL]: '',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_COVID]: 'Covid',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OUTSIZE]: 'Quá cỡ',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXVOLUME]: 'Sửa kích thước',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXWEIGHT]: 'Sửa trọng lượng',
  [PACKAGE_UPDATE_EXTRAFEE_EDIT_ORDER]: 'Sửa đơn',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_REFUND]: 'Hoàn tiền',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OTHER]: 'Phí phát sinh khác',
  [PACKAGE_CHECK_ADDRESS_TYPE]: 'Xác nhận xóa cảnh báo địa chỉ không hợp lệ',
  [PACKAGE_IGNORE_ADDRESS_TYPE]: 'Bỏ qua kiểm tra địa chỉ bằng API',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_RESHIP]: 'Reship',
  [PACKAGE_UPDATE_TYPE_ORDER_NUMBER]: 'Mã đơn hàng',
  [PACKAGE_UPDATE_TYPE_PRODUCT]: '',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_PEAK]: '',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_CANCEL_LABEL]: 'Hủy Label',
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OVERSIZE]: 'Phí quá thể tích',
  [PACKAGE_UPDATE_ADRESS_EXCEED_PACKAGE]: 'Phí sửa địa chỉ',
  [PACKAGE_UPDATE_RETURN_PACKAGE]: 'Return',
}
// cSpell:enable

export const DELIVER_LOG_PACKAGE = {
  [PACKAGE_STATUS_IN_TRANSIT]: 'Arriving at international airport to go abroad',
  [PACKAGE_STATUS_PENDING_PICKUP]:
    'Shipping label created, LionBay awaiting item',
  [PACKAGE_STATUS_RE_PENDING_PICKUP]:
    'Shipping label created, LionBay awaiting item',
  [PACKAGE_STATUS_PICKED]: 'Accepted at LionBay Processing	Center',
  [PACKAGE_STATUS_CANCELLED]: 'Label canceled',
  [PACKAGE_STATUS_DELIVERED]: 'Delivered',
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: 'Departed from LionBay Processing Center',
  [PACKAGE_DELIVERY_LOG_TYPE_RESHIP]: 'Reship package',
}

export const ROLE_ADMIN = 'admin'
export const ROLE_SUPPORT = 'support'
export const ROLE_ACCOUNTANT = 'accountant'

export const EXTRA_FEE_TYPE_DISCOUNT = 15
