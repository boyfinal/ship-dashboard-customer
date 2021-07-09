export const routes = [
  {
    path: '/claims',
    name: 'claims',
    meta: {
      title: 'Khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/ListClaim.vue'),
  },
  {
    path: '/claims/:id',
    name: 'claim-detail',
    meta: {
      title: 'Chi tiết khiếu nại',
    },
    component: () =>
      import(/* webpackChunkName: "settings" */ './views/ClaimDetail.vue'),
  },
]
