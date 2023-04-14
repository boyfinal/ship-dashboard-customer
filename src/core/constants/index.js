// Roles
export const ROLE_CUSTOMER = 'customer'
export const ROLE_ADMIN = 'admin'
export const ROLE_SUPPORT = 'support'
export const ROLE_ACCOUNTANT = 'accountant'

// Order and order status
export const ORDER_STATUS_DRAFT = 'draft'
export const ORDER_STATUS_PENDING = 'pending'
export const ORDER_STATUS_PROCESS = 'process'
export const ORDER_STATUS_PAID = 'paid'
export const ORDER_STATUS_UNPAID = 'unpaid'
export const ORDER_STATUS_CANCELED = 'canceled'
export const ORDER_STATUS_FULFILLED = 'fulfilled'
export const ORDER_STATUS_AWAITING = 'awaiting'
export const ORDER_STATUS_REJECT = 'rejected'

export const ACL_KEYS = {
  setStatusPaid: 'setStatusPaid',
  setStatusUnPaid: 'setStatusUnPaid',
  setStatusProcess: 'setStatusProcess',
  setStatusContainerCancel: 'setStatusContainerCancel',
  setStatusOrderCancel: 'setStatusOrderCancel',
  importTrackingNumber: 'updateTrackingNumber',
  updateOrder: 'updateOrder',
}

export const ACL = {
  [ACL_KEYS.updateOrder]: [ROLE_CUSTOMER],
}

export const NOT_STAFF_GET_LIMIT = 200
export const KG_TO_GRAM = 1000

export const MAX_DESIGN_FILE = 15
//user
export const USER_CLASS_PUBLIC = 1
export const USER_CLASS_PRIORITY = 2
export const USER_CLASS_PARTNER = 3

export const MAP_USER_CLASS_TEXT = {
  [USER_CLASS_PUBLIC]: 'Public',
  [USER_CLASS_PRIORITY]: 'Priority',
  [USER_CLASS_PARTNER]: 'Partner',
}
