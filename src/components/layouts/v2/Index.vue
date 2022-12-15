<template>
  <div
    class="animsition dashboard"
    :class="{
      'site-menubar-unfold': isSidebarOpen,
      'site-menubar-hide': !isSidebarOpen,
    }"
  >
    <p-header :user="user" />
    <p-sidebar @toggleShowSidebar="toggleShowSidebar" />

    <router-view
      :key="$route.path"
      :class="{ padding_page: warning }"
    ></router-view>
    <div class="warning-user" v-if="warning"
      ><span
        >Tài khoản của bạn đã quá hạn mức dư nợ. Vui lòng
        <router-link :to="{ name: 'bill', params: { topup: true } }"
          >nạp tiền</router-link
        >
        để tiếp tục.</span
      ></div
    >
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import '@assets/scss/main.scss'
import '@assets/fonts/material-design/material-design.min.css'
import '@assets/fonts/web-icons/web-icons.min.css'
import PHeader from './Header'
import PSidebar from './Sidebar'
import { GET_USER, GET_CONFIGS } from '../../../packages/shared/store'
import firebase from '../../../core/services/firebase'
import crisp from '../../../core/services/crisp'

export default {
  name: 'Version2',
  components: {
    PHeader,
    PSidebar,
  },
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      isSidebarOpen: true,
      isTicketOpen: false,
      warning: false,
    }
  },
  mounted() {
    this.init()
  },
  created() {
    firebase.setup()
  },
  methods: {
    ...mapActions('shared', [GET_USER, GET_CONFIGS]),
    async init() {
      await this.getUser()
      this.checkDebtUser()

      if (this.user) {
        crisp.init(this.user.id)
        crisp.setup(this.user)
      }

      const result = await this[GET_CONFIGS]()

      if (!result.success) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 4000,
        })
      }
    },
    checkDebtUser() {
      if (!this.user.user_info) {
        return
      }
      var now = new Date()
      var dt = new Date(this.user.user_info.debt_time)
      dt.setDate(dt.getDate() + this.user.user_info.debt_max_day)
      if (
        this.user.user_info.debt_time !== null &&
        this.user.balance < 0 &&
        dt.getTime() < now.getTime()
      ) {
        this.warning = true
        this.$store.commit('shared/checkDebt', true)
        return
      }
      if (
        this.user.balance < 0 &&
        Math.abs(this.user.balance) > this.user.user_info.debt_max_amount
      ) {
        this.warning = true
        this.$store.commit('shared/checkDebt', true)
        return
      }
      this.warning = false
      this.$store.commit('shared/checkDebt', false)
    },
    toggleShowSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      const srisp = document.querySelector(
        '.crisp-client .cc-52lo .cc-kegp .cc-1oun'
      )

      if (srisp) {
        srisp.style.setProperty('left', 'unset', 'important')
        if (
          to.name == 'package-detail' ||
          (to.name == 'package-create' && srisp)
        ) {
          srisp.style.setProperty('margin-bottom', '110px', 'important')
        } else {
          srisp.style.setProperty('margin-bottom', 'unset', 'important')
        }
      }
    },
  },
}
</script>

<style lang="scss">
.warning-user {
  width: calc(100% - 120px);
  height: 56px;
  position: fixed;
  z-index: 3;
  bottom: 0;
  right: 0;
  background-color: #fff7e6;
  color: #fa8c16;
  display: flex;

  align-items: center;
  justify-content: center;
  a {
    color: #fa8c16;
    text-decoration: underline;
  }
}

.padding_page {
  padding-bottom: 56px;
  .fee,
  .page-footer {
    bottom: 56px !important;
  }
}
</style>
