export const routes = [
  {
    path: '/shipments',
    name: 'shipment-list',
    meta: {
      title: 'Danh sách lô hàng',
    },
    component: () =>
      import(/* webpackChunkName: "shipments" */ './views/List.vue'),
  },
  {
    path: '/shipments',
    name: 'shipment-detail',
    meta: {
      title: 'Chi tiết lô hàng',
    },
    component: () =>
      import(/* webpackChunkName: "shipments" */ './views/Detail.vue'),
  },
]
