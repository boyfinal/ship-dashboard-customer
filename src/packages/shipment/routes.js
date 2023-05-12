export const routes = [
  {
    path: '/shipments',
    name: 'shipment-list',
    meta: {
      title: 'Danh sách lô hàng FBA',
    },
    component: () =>
      import(/* webpackChunkName: "shipments" */ './views/List.vue'),
  },
  {
    path: '/shipments/:id',
    name: 'shipment-detail',
    meta: {
      title: 'Chi tiết lô hàng FBA',
      detail: true,
      routeParent: { name: 'shipment-list' },
    },
    component: () =>
      import(/* webpackChunkName: "shipments" */ './views/Detail.vue'),
  },
]
