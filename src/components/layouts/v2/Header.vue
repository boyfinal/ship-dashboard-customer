<template>
  <nav class="site-navbar" role="navigation">
    <div class="navbar__header">
      <div class="navbar__header-left">
        <div class="title">
          <router-link
            v-if="this.$route.meta.detail && this.$route.meta.routeParent.name"
            :to="{ name: this.$route.meta.routeParent.name }"
          >
            <inline-svg
              :src="require('../../../../src/assets/img/arrow_left.svg')"
            ></inline-svg>
          </router-link>
          {{ handleTitle }}
        </div>
      </div>

      <!--      Start Notifications  -->
      <div class="navbar__header-right d-flex align-items-center">
        <div
          class="navbar_header-map-point"
          :class="{ 'mr-8': promotion, 'mr-30': !promotion }"
        >
          <button class="btn btn-map-point" @click="handleMapPoint">
            <inline-svg
              :src="
                require('../../../../src/assets/img/location-warehouse.svg')
              "
            >
            </inline-svg>
            <span>Lionbay Point</span>
          </button>
        </div>
        <div class="navbar_header-map-point mr-30" v-if="promotion">
          <button
            class="btn btn-map-point"
            @click="handlePromotions"
            style="width: 126px;"
          >
            <inline-svg
              :src="require('../../../../src/assets/img/promotion_icon.svg')"
            >
            </inline-svg>
            <span>Promotion</span>
          </button>
        </div>
        <div class="navbar__header-noti">
          <p-dropdown :multiple="false" class="">
            <div class="noti__dropdown-icon" slot="trigger">
              <inline-svg
                :src="require('../../../../src/assets/img/normal.svg')"
                class=""
              ></inline-svg>
              <div v-if="convertNumber > 0" class="noti__dropdown-count">{{
                convertNumber
              }}</div>
            </div>

            <div class="noti__dropdown">
              <div class="noti__dropdown-header d-flex">
                <div class="noti__dropdown-label">Notifications</div>
                <div
                  v-if="count > 0"
                  class="noti__dropdown-mark"
                  @click="handleReadAll"
                  >Đánh dấu là đã đọc</div
                >
              </div>

              <div class="noti__dropdown-list">
                <div
                  class="noti__dropdown-content"
                  v-if="notifications.length > 0"
                >
                  <p-dropdown-item
                    v-for="(item, i) in notifications"
                    :key="i"
                    @click="handelReadNoti(item)"
                    :class="{ unread: item.readed == NotificationUnread }"
                    class="noti__dropdown-item"
                  >
                    <div class="item-content">
                      <!--                      <div class="item-icon ">-->
                      <!--                        <inline-svg-->
                      <!--                          :src="require('../../../../src/assets/img/icon-noti.svg')"-->
                      <!--                          class=""-->
                      <!--                        ></inline-svg>-->
                      <!--                      </div>-->
                      <div class="item-text ml-7"
                        >{{ item.title }}
                        <div class="item-date">{{
                          item.created_at | datetime('dd/MM/yyyy - HH:mm')
                        }}</div>
                      </div>
                    </div>
                  </p-dropdown-item>
                </div>
                <div class="no-noti" v-else>Không có thông báo nào.</div>
              </div>
              <p-dropdown-item class="all">
                <div class="noti__dropdown-footer d-flex">
                  <div v-if="notifications.length > 0" class="view-all">
                    <router-link to="/notification"> Xem tất cả </router-link>
                  </div>
                </div>
              </p-dropdown-item>
            </div>
          </p-dropdown>
        </div>

        <!--    End    Notifications-->
        <p-dropdown>
          <div class="pointer" slot="trigger">
            <inline-svg
              :src="require('../../../../src/assets/img/avatar-noti.svg')"
            ></inline-svg>
            <div class="user_info ml-7">
              <div class=""
                ><span class="username">{{ user.full_name }}</span>
                <inline-svg
                  :src="
                    require('../../../../src/assets/img/Chevron Down 16px.svg')
                  "
                  class="icon-down"
                ></inline-svg>
              </div>

              <div class="type" v-if="user">
                <inline-svg
                  v-if="isDebt"
                  :src="require('../../../assets/img/warningsm.svg')"
                >
                </inline-svg>
                {{ types[user.class] }}<i class="fa fa-circle"></i>
                <span
                  v-if="user.user_info && user.user_info.debt_max_amount > 0"
                  >Trả sau</span
                >
                <span v-else>Trả trước</span>
              </div>
            </div>
          </div>
          <p-dropdown-item>
            <router-link
              :to="{ name: 'home' }"
              class="nav-item nav-item-disabled"
            >
              <inline-svg
                class="navbar__header-icon"
                :src="require('../../../../src/assets/img/lifebuoy.svg')"
              >
              </inline-svg>
              Hỏi đáp trợ giúp
            </router-link>
          </p-dropdown-item>
          <p-dropdown-item>
            <router-link :to="{ name: 'claims' }" class="nav-item">
              <inline-svg
                class="navbar__header-icon"
                :src="
                  require('../../../../src/assets/img/message-question.svg')
                "
              ></inline-svg>
              Khiếu nại
            </router-link>
          </p-dropdown-item>
          <p-dropdown-item>
            <router-link to="/logout" class="nav-item">
              <inline-svg
                class="navbar__header-icon"
                :src="require('../../../../src/assets/img/Logout.svg')"
              >
              </inline-svg>
              Đăng xuất
            </router-link>
          </p-dropdown-item>
        </p-dropdown>
      </div>
    </div>
    <modal-map-point
      :visible.sync="isVisibleMapPoint"
      :uploading="true"
      v-if="isVisibleMapPoint"
    >
    </modal-map-point>
    <modal-promotion v-if="promotion" :visible.sync="isVisiblePromotion">
    </modal-promotion>
  </nav>
</template>
<script>
import { MAP_USER_CLASS_TEXT } from '@core/constants'
import { mapState, mapActions, mapGetters } from 'vuex'
import PDropdown from '../../../../uikit/components/dropdown/Dropdown'
import {
  FETCH_NOTIFICATIONS,
  READ_NOTIFICATIONS,
  READ_NOTIFICATION,
  GET_COUNT,
  GET_NOTIFICATION,
} from '../../../packages/shared/store'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import { numFormatter } from '@core/utils/formatter'
import {
  NotificationRead,
  NotificationUnread,
} from '../../../packages/shared/constants'
import PDropdownItem from '../../../../uikit/components/dropdown/DropdownItem'
import ModalMapPoint from './ModalMapPoint.vue'
import ModalPromotion from '@components/shared/modal/ModalPromotion'
export default {
  components: {
    ModalPromotion,
    PDropdownItem,
    PDropdown,
    ModalMapPoint,
  },
  mixins: [mixinRoute, mixinTable],
  name: 'Header',
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState('shared', {
      isDebt: (state) => state.isDebt,
      promotion: (state) => state.promotion,
    }),
    ...mapGetters('shared', {
      count: GET_COUNT,
      notifications: GET_NOTIFICATION,
    }),
    types() {
      return MAP_USER_CLASS_TEXT
    },
    handleTitle() {
      return this.$route.meta.title || ''
    },
    convertNumber() {
      return numFormatter(this.count)
    },
  },
  created() {},
  data() {
    return {
      visibleModal: false,
      filter: {
        limit: 7,
        page: 1,
        count: {
          unread: 1,
        },
      },
      NotificationUnread: NotificationUnread,
      isVisibleMapPoint: false,
      isVisiblePromotion: false,
    }
  },
  methods: {
    ...mapActions('shared', [
      FETCH_NOTIFICATIONS,
      READ_NOTIFICATIONS,
      READ_NOTIFICATION,
    ]),
    handleMapPoint() {
      this.isVisibleMapPoint = true
    },
    handlePromotions() {
      this.isVisiblePromotion = true
    },
    async init() {
      const result = await this[FETCH_NOTIFICATIONS](this.filter)
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
    },
    async handleReadAll() {
      const result = await this[READ_NOTIFICATIONS]()
      if (!result.success) {
        this.$toast.open({ message: result.message, type: 'error' })
      }
      this.init()
    },
    async handelReadNoti(item) {
      if (item.link) {
        if (!item.type) {
          var url = item.link.replace(
            // eslint-disable-next-line no-useless-escape
            /(http[s]?:\/\/)?([^\/\s]+(\/)|^[\/])/,
            ''
          )
          this.$router.replace({ path: `/${url}` })
        } else {
          window.open(item.link, '_blank')
        }
      }
      if (item.readed == NotificationRead) return
      const arr = []
      arr.push(item.id)
      let read = await this[READ_NOTIFICATION](arr)
      if (!read.success) {
        this.$toast.open({ type: 'error', message: 'Có lỗi xảy ra' })
      }
    },
  },
}
</script>

<style lang="scss">
.user_info {
  .type {
    align-items: center;
    display: flex;
    float: left;
    font-weight: 600;
    font-size: 10px;
    color: #626363;

    i {
      font-size: 4px;
      margin-right: 4px;
      margin-left: 4px;
    }

    svg {
      margin: 0 4px 1px 0;
    }
  }
}
</style>
