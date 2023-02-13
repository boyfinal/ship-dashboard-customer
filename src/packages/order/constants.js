export const ORDER_STATUS_IN_TRANSIT = 1
export const ORDER_STATUS_PROCESS = 2
export const ORDER_STATUS_DELIVERED = 3

export const ORDER_STATUS_IN_TRANSIT_TEXT = 'in-transit'
export const ORDER_STATUS_PROCESS_TEXT = 'process'
export const ORDER_STATUS_DELIVERED_TEXT = 'delivered'

export const ORDER_STATUS_TAB = [
  {
    id: 0,
    value: '',
    text: 'All',
  },
  {
    id: ORDER_STATUS_IN_TRANSIT,
    value: ORDER_STATUS_IN_TRANSIT_TEXT,
    text: 'In-Transit',
  },
  {
    id: ORDER_STATUS_PROCESS,
    value: ORDER_STATUS_PROCESS_TEXT,
    text: 'Process',
  },
  {
    id: ORDER_STATUS_DELIVERED,
    value: ORDER_STATUS_DELIVERED_TEXT,
    text: 'Delivered',
  },
]

export const ORDER_STATUS = {
  [ORDER_STATUS_IN_TRANSIT]: {
    className: 'default',
    text: 'In-Transit',
  },
  [ORDER_STATUS_PROCESS]: {
    className: 'primary',
    text: 'Process',
  },
  [ORDER_STATUS_DELIVERED]: {
    className: 'success',
    text: 'Delivered',
  },
}

export const MAP_ORDER_STATUS = {
  [ORDER_STATUS_IN_TRANSIT_TEXT]: ORDER_STATUS_IN_TRANSIT,
  [ORDER_STATUS_PROCESS_TEXT]: ORDER_STATUS_PROCESS,
  [ORDER_STATUS_DELIVERED_TEXT]: ORDER_STATUS_DELIVERED,
}
