export const routes = [
  {
    path: '/packages/create',
    name: 'package-create',
    meta: {
      title: 'Tạo đơn',
    },
    component: () =>
      import(/* webpackChunkName: "packages" */ './views/CreatePackage.vue'),
  },
  {
    path: '/packages',
    name: 'list-packages',
    meta: {
      title: 'Quản lý đơn hàng',
    },
    component: () =>
      import(/* webpackChunkName: "packages" */ './views/ListPackages'),
  },
  {
    path: '/packages/:id',
    name: 'package-detail',
    meta: {
      title: 'Chi tiết đơn hàng',
      detail: true,
      routeParent: { name: 'list-packages' },
    },
    component: () =>
      import(/* webpackChunkName: "packages" */ './views/PackageDetail'),
  },
  {
    path: '/packages-return',
    name: 'packages-return',
    meta: {
      title: 'Quản lý đơn hàng trả về',
    },
    component: () =>
      import(/* webpackChunkName: "packages" */ './views/ListPackagesReturn'),
  },
]
