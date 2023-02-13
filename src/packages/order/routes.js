export const routes = [
  {
    path: '/orders',
    name: 'order-list',
    meta: {
      title: 'Quản lý kiện hàng',
    },
    component: () =>
      import(/* webpackChunkName: "orders" */ './views/List.vue'),
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    meta: {
      title: 'Chi tiết kiện hàng',
      detail: true,
      routeParent: { name: 'order-list' },
    },
    component: () =>
      import(/* webpackChunkName: "orders" */ './views/Detail.vue'),
  },
]
