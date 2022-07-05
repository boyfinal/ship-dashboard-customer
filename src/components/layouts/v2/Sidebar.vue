<template>
  <div class="site-menubar" :class="{ 'active-collap': !isSidebarOpen }">
    <div class="site-menubar-logo">
      <router-link to="/"
        ><img src="@assets/img/logo_lionbay_white.svg" alt="lionbay"
      /></router-link>
    </div>
    <div class="site-menubar-body">
      <ul class="site-menu">
        <li
          v-for="(menu, i) in menus"
          class="site-menu-item"
          :class="{
            active:
              isActive(menu.route) ||
              childrenNameRoute(menu.route.name) ||
              isContainAlias(menu.alias),
          }"
          :key="i"
        >
          <router-link
            :to="handelRouter(menu)"
            class="item-link"
            @mouseover.native="openItem(menu)"
            @mouseleave.native="closeItem(menu)"
          >
            <div class="item-link-content">
              <img class="site-menu-icon default" :src="menu.icon" />
              <img class="site-menu-icon active" :src="menu.iconActive" />
              <span class="site-menu-title">{{ menu.title }}</span>
              <span v-if="!menu.sub" class="tooltip">{{ menu.tooltip }}</span>
            </div>
            <transition name="fade">
              <div class="open-right">
                <div
                  class="site-menu-sub"
                  :class="{
                    'has-sub': menu.isOpen,
                  }"
                  v-if="menu.sub"
                >
                  <div
                    class="site-menu-sub-item"
                    v-for="(sub, j) in menu.sub"
                    :key="j"
                  >
                    <router-link
                      :to="sub.route"
                      class="animsition-link"
                      @click.native="closeItem(menu)"
                    >
                      <div
                        :class="{
                          active:
                            isActive(sub.route) ||
                            isContainAlias(sub.alias) ||
                            childrenNameRoute(sub.title),
                        }"
                        class="site-menu-sub-title d-flex"
                      >
                        <img
                          class="default"
                          src="@assets/img/Arrow - Right Circle.svg"
                          alt=""
                        />
                        <img
                          class="hover"
                          src="@assets/img/Arrow - Right CircleHover.svg"
                          alt=""
                        />

                        <span>{{ sub.title }}</span></div
                      >
                    </router-link>
                  </div>
                </div>
              </div>
            </transition>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="site-menubar-claim">
      <div
        class="site-menu"
        :class="{ 'site-menu-active': visibleModal }"
        @click="handleVisibleModalClaim"
      >
        <div class="claim-icon">
          <inline-svg
            :src="
              require('../../../../src/assets/img/message-question-bold.svg')
            "
          ></inline-svg
        ></div>
        <div class="claim">Tạo trợ giúp, khiếu nại</div>
      </div>
    </div>

    <div class="site-menubar-footer">
      <hr class="site-menubar-hr" />
      <p-tooltip
        :label="isSidebarOpen ? `Thu gọn menu` : `Mở rộng menu`"
        size="large"
        position="top"
        type="dark"
      >
        <div class="menubar-icon" @click="toggleSidebar">
          <inline-svg
            :src="require('../../../../src/assets/img/leftcollapse.svg')"
          ></inline-svg>
        </div>
      </p-tooltip>
    </div>

    <modal-add-claim :visible.sync="visibleModal" :title="`Khiếu nại`">
    </modal-add-claim>
  </div>
</template>

<style></style>

<script>
import { isObject } from '@core/utils/type'
import ModalAddClaim from '../../../packages/claim/components/ModalAddClaim.vue'

export default {
  name: 'Sidebar',
  components: {
    ModalAddClaim,
  },
  props: {
    // isSidebarOpen: {
    //   type: Boolean,
    //   default: true,
    // },
  },

  computed: {
    availableMenus() {
      return this.menus.filter((menu) => menu.disable !== true)
    },
  },
  data() {
    return {
      isSidebarOpen: true,
      hoverIndex: -1,
      isActiveSub: false,
      activeSubIndex: 0,
      isactive: false,
      activeItem: '',
      menus: [
        {
          title: 'Trang chủ',
          icon: require('@assets/img/Home.png'),
          iconActive: require('@assets/img/HomeActive.png'),
          route: '/',
          class: '',
          tooltip: 'Trang chủ',
        },
        {
          title: 'Đơn hàng',
          icon: require('@assets/img/Order.png'),
          iconActive: require('@assets/img/OrderActive.png'),
          route: { name: 'list-packages' },
          class: '',
          isOpen: false,
          tooltip: 'Đơn hàng',
          alias: [
            '/packages',
            '/packages/:id',
            '/packages/create',
            '/packages-return',
          ],
          sub: [
            {
              route: '/packages',
              title: 'Đơn hàng',
            },
            {
              route: '/packages-return',
              title: 'Hàng trả về',
            },
          ],
        },
        {
          title: 'Hóa đơn',
          icon: require('@assets/img/Bill.png'),
          iconActive: require('@assets/img/BillActive.png'),
          route: { name: 'bill' },
          class: '',
          isOpen: false,
          tooltip: 'Hóa đơn',
          // alias: ['/bill/wallet'],
        },
        {
          title: 'Tracking',
          icon: require('@assets/img/tracking_tab.svg'),
          iconActive: require('@assets/img/tracking_active_tab.svg'),
          route: { name: 'tracking' },
          class: '',
          tooltip: 'Tracking',
        },
        {
          title: 'Cài đặt',
          icon: require('@assets/img/Setting.png'),
          iconActive: require('@assets/img/SettingActive.png'),
          route: { name: 'setting' },
          class: '',
          isOpen: false,
          tooltip: '',
          sub: [
            {
              route: '/setting/account',
              title: 'Thông tin tài khoản',
            },
            {
              route: '/setting/product',
              title: 'Danh sách sản phẩm',
            },
            {
              route: '/setting/templates',
              title: 'Import templates',
            },
            {
              route: '/setting/api',
              title: 'API',
            },
            {
              route: '/setting/label',
              title: 'Customize label',
            },
          ],
        },
      ],
      visibleModal: false,
    }
  },

  methods: {
    isActive(route) {
      if (isObject(route)) {
        return this.$route.name === route.name
      }
      return this.$route.path === route || this.$route.fullPath === route
    },

    isContainAlias(alias) {
      if (!this.$route.matched || !this.$route.matched.length || !alias) {
        return false
      }

      for (let item of this.$route.matched) {
        if (alias.includes(item.path)) {
          return true
        }
      }
      return false
    },

    childrenNameRoute(title) {
      let fullPath = this.$route.fullPath

      if (title != null) {
        title = title.toLowerCase()
        if (fullPath.includes(title)) {
          return true
        }
      }
      return false
    },
    handelRouter(menu) {
      if (menu.sub) {
        return ''
      }
      return menu.route
    },
    openItem(menu) {
      menu.isOpen = true
    },
    closeItem(menu) {
      menu.isOpen = false
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggleShowSidebar')
    },
    handleVisibleModalClaim() {
      this.visibleModal = true
    },
  },
}
</script>
