import {
  PACKAGE_STATUS_CREATED,
  PACKAGE_STATUS_PENDING_PICKUP,
  PACKAGE_STATUS_RE_PENDING_PICKUP,
  PACKAGE_STATUS_PICKED,
  PACKAGE_STATUS_WAREHOUSE_LABELED,
  PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER,
  PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT,
  PACKAGE_STATUS_WAREHOUSE_EXPORT,
  PACKAGE_STATUS_IN_TRANSIT,
  PACKAGE_STATUS_DELIVERED,
  // PACKAGE_STATUS_RETURNED,
  PACKAGE_STATUS_CANCELLED,
  PACKAGE_STATUS_EXPIRED,
  // PACKAGE_STATUS_RESHIP,
  PACKAGE_STATUS_UNDELIVERED,
  PACKAGE_STATUS_ARCHIVED,
  PACKAGE_STATUS_CREATED_TEXT,
  PACKAGE_STATUS_PENDING_PICKUP_TEXT,
  PACKAGE_STATUS_PROCESSING_TEXT,
  PACKAGE_STATUS_IN_TRANSIT_TEXT,
  PACKAGE_STATUS_DELIVERED_TEXT,
  // PACKAGE_STATUS_ALERT_TEXT,
  PACKAGE_STATUS_CANCELLED_TEXT,
  PACKAGE_STATUS_EXPIRED_TEXT,
  PACKAGE_STATUS_UNDELIVERED_TEXT,
  // PACKAGE_STATUS_RETURN_TEXT,
  PACKAGE_STATUS_ARCHIVED_TEXT,
} from '../package/constants'

export const MAP_SHIPMENT_STATUS = {
  [PACKAGE_STATUS_CREATED]: {
    text: PACKAGE_STATUS_CREATED_TEXT,
    className: 'await',
  },
  [PACKAGE_STATUS_PENDING_PICKUP]: {
    text: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    className: 'pending',
  },
  [PACKAGE_STATUS_RE_PENDING_PICKUP]: {
    text: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    className: 'pending',
  },
  [PACKAGE_STATUS_PICKED]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_LABELED]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: 'primary',
  },
  [PACKAGE_STATUS_IN_TRANSIT]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: 'default',
  },
  [PACKAGE_STATUS_DELIVERED]: {
    text: PACKAGE_STATUS_DELIVERED_TEXT,
    className: 'success',
  },
  [PACKAGE_STATUS_CANCELLED]: {
    text: PACKAGE_STATUS_CANCELLED_TEXT,
    className: 'danger',
  },
  [PACKAGE_STATUS_EXPIRED]: {
    text: PACKAGE_STATUS_EXPIRED_TEXT,
    className: 'expired',
  },
  [PACKAGE_STATUS_UNDELIVERED]: {
    text: PACKAGE_STATUS_UNDELIVERED_TEXT,
    className: 'danger',
  },
  [PACKAGE_STATUS_ARCHIVED]: {
    text: PACKAGE_STATUS_ARCHIVED_TEXT,
    className: 'danger',
  },
}

export const SHIPMENT_STATUS_TAB = [
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
  {
    value: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    text: 'In-Transit',
  },
  {
    value: PACKAGE_STATUS_DELIVERED_TEXT,
    text: 'Delivered',
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
