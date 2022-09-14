<template>
  <div class="notification__page pages">
    <div class="container">
      <div class="page-header">
        <notification-status-tab
          v-model="filter.type"
          :status="notifyTypes"
          :count="countType"
        />
      </div>
      <div class="page-content">
        <VclTable class="mt-20" v-if="isFetching"></VclTable>
        <template v-else-if="notifications.length">
          <div
            v-for="(item, i) in notifications"
            :key="i"
            :class="{ unread: item.readed == NotificationUnread }"
            @click="handelReadNoti(item)"
            class="noti__dropdown-item"
          >
            <div class="item-content">
              <inline-svg :src="getIcon(item.type)"></inline-svg>
              <div class="item-text">
                <div class="item-body">
                  {{ item.title }}
                </div>
                <div class="item-date">{{
                  item.created_at | datetime('dd/MM/yyyy - HH:mm')
                }}</div>
              </div>
            </div>
            <div
              class="notify-body"
              :class="{ 'body-icon': getIcon(item.type) }"
            >
              {{ item.body }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="page-content page-not-found empty-notify">
            <div class="content">
              <div class="content_404">
                <div class="content_404-img">
                  <inline-svg
                    :src="
                      require('../../../../src/assets/img/empty_notify.svg')
                    "
                  ></inline-svg>
                  <p style="margin-top: 16px;"
                    >Bạn chưa nhận được thông báo nào!</p
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="page-footer mb-80" v-if="count > 0">
        <p-pagination
          :total="count"
          :perPage.sync="filter.limit"
          :current.sync="filter.page"
          size="sm"
        ></p-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import NotificationStatusTab from '../components/NotificationStatusTab'
import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_ALL,
  READ_NOTIFICATION,
} from '../../shared/store'
import {
  NotificationRead,
  NotificationUnread,
} from '../../../packages/shared/constants'
import {
  NOTIFY_TYPE,
  NOTIFY_TYPE_ORDER_UPDATE,
  NOTIFY_TYPE_FINANCE_UPDATE,
  NOTIFY_TYPE_ANNOUNCEMENT,
  NOTIFY_TYPE_SERVICE_UPDATE,
  NOTIFY_TYPE_PROMOTION,
} from '../constant'

export default {
  name: 'Notification',
  components: {
    NotificationStatusTab,
  },
  mixins: [mixinRoute, mixinTable],
  computed: {
    ...mapState('shared', {
      notifications: (state) => state.notificationAll,
      count: (state) => state.countNotiAll,
      countType: (state) => {
        const countType = state.typeStatus.map(({ count, type }) => {
          return {
            count: count,
            status: type,
          }
        })
        return countType
      },
    }),
    notifyTypes() {
      const type = NOTIFY_TYPE.map(({ text, value }) => [text, value])
      return Object.fromEntries(type)
    },
  },
  data() {
    return {
      filter: {
        limit: 25,
        page: 1,
        type: '',
      },
      isFetching: false,
      NotificationUnread: NotificationUnread,
      NotificationRead: NotificationRead,
      filterUnread: {
        limit: 7,
        page: 1,
        count: {
          unread: 1,
        },
      },
    }
  },
  methods: {
    ...mapActions('shared', [
      FETCH_NOTIFICATIONS_ALL,
      FETCH_NOTIFICATIONS,
      READ_NOTIFICATION,
    ]),
    handelReadNoti(item) {
      if (item.link) {
        if (!item.type) {
          var url = item.link.replace(
            // eslint-disable-next-line no-useless-escape
            /(http[s]?:\/\/)?([^\/\s]+(\/)|^[\/])/,
            ''
          )
          this.$router.push({ path: `/${url}` })
        } else {
          window.open(item.link, '_blank')
        }
      }
      this.callRead(item)
    },
    async callRead(item) {
      if (item.readed == NotificationRead) return

      const arr = []
      arr.push(item.id)
      let read = await this[READ_NOTIFICATION](arr)
      if (!read.success) {
        this.$toast.open({ type: 'error', message: 'Có lỗi xảy ra' })
      }
    },
    async init() {
      this.handleUpdateRouteQuery()
      let limit = this.filter
      this.isFetching = true
      await this[FETCH_NOTIFICATIONS_ALL](limit)
      this.isFetching = false
    },
    getIcon(type) {
      switch (type) {
        case NOTIFY_TYPE_ORDER_UPDATE:
          return require('../../../../src/assets/img/order_update_notify.svg')
        case NOTIFY_TYPE_FINANCE_UPDATE:
          return require('../../../../src/assets/img/finance_update_notify.svg')
        case NOTIFY_TYPE_ANNOUNCEMENT:
          return require('../../../../src/assets/img/announcement_notify.svg')
        case NOTIFY_TYPE_SERVICE_UPDATE:
          return require('../../../../src/assets/img/service_notify.svg')
        case NOTIFY_TYPE_PROMOTION:
          return require('../../../../src/assets/img/promotion_notify.svg')
        default:
          return require('../../../../src/assets/img/no_type_notify.svg')
      }
    },
  },
  created() {
    this.init()
  },
  watch: {
    filter: {
      handler: function() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>
