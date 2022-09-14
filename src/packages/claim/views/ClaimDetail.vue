<template>
  <div class="claim-detail-page pages page-sm">
    <div class="container">
      <div v-if="!isEmpty" class="page-content claim-content-page">
        <!-- <router-link :to="{ name: 'claims' }" class="text">
            <img
              src="@/assets/img/Arrow - Left Square 24px.png"
              class="page-header_back_icon"
            />

            Khiếu nại
          </router-link> -->
        <div class="row">
          <div class="col-8 p-0 b-right">
            <div class="card-block claim-content" :class="{ closed: isClosed }">
              <div class="card-content">
                <span v-if="isClosed" class="status"
                  ><img src="~@/assets/img/check.svg" />Khiếu nại đã được xử
                  lý</span
                >
                <h1 class="title">{{ claim.title }}</h1>
                <div class="description">
                  <p>{{ claim.content }}</p>
                </div>
              </div>
            </div>
            <div class="card-block claim-messages">
              <div class="card-content">
                <div
                  class="scroll-y"
                  ref="message"
                  id="box-message"
                  v-on:scroll="onscroll"
                >
                  <div class="list-messages">
                    <Message
                      v-for="(mes, i) in displayMessages"
                      :key="i"
                      :current="mes"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card-block claim-reply" v-if="!isClosed">
              <div class="card-content">
                <div class="claim-reply-form d-flex">
                  <div class="upload">
                    <p-tooltip
                      :label="'Đính kèm file'"
                      size="large"
                      position="top"
                      type="dark"
                      :active="true"
                    >
                      <upload
                        class="file-uploader"
                        :action="uploadFileEndpoint"
                        drag
                        list-type="picture"
                        :headers="uploadHeaders"
                        @e-change="listenChange"
                        :on-change="handleChangeFile"
                        multiple
                        :auto-upload="false"
                        :on-max-size="errorMaximum"
                        :max-file-size="maximumSize"
                      >
                        <img src="@assets/img/upload_file.png" alt="" />
                      </upload>
                    </p-tooltip>
                  </div>
                  <textarea
                    class="form-control"
                    resize="false"
                    placeholder="Nhập lời nhắn..."
                    v-model="message"
                    data-vv-as="Nội dung"
                    name="message"
                    :class="{
                      'error-color': errors.has('message'),
                      require: lengthContent,
                    }"
                    maxlength="1000"
                    v-validate="'required'"
                  ></textarea>
                  <p-button
                    class="btn btn-primary"
                    :loading="isUploading"
                    @click.prevent="handleReply"
                    >Gửi trả lời</p-button
                  >
                </div>
                <span class="err-span" v-if="errors.has('message')">{{
                  errors.first('message')
                }}</span>
                <p class="note"
                  >* Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung
                  lượng dưới 5Mb</p
                >
                <div v-if="fileErrors.length > 0" class="ticket__error mb-16">
                  <div class="ticket__error-title">
                    <img
                      src="~@/assets/img/alert.svg"
                      alt=""
                      class="ticket__error-icon"
                    />
                    <span>Tệp tin chưa được thêm vào:</span>
                  </div>
                  <ul class="ticket__error-list">
                    <li
                      v-for="(item, i) in fileErrors"
                      :key="i"
                      class="ticket__error-item"
                    >
                      {{ item }}</li
                    >
                  </ul>
                </div>

                <div v-if="files.length" class="ticket__reply-files mb-16">
                  <div
                    class="el-before-upload__filename d-flex"
                    v-for="(item, i) in files"
                    :key="i"
                  >
                    <div class="filename mr-3">{{ item.name }}</div>
                    <div :class="{ isUpload: isUploading }" class="remove-file">
                      <img
                        src="~@/assets/img/x-sm.svg"
                        alt=""
                        class="icon-remove"
                        @click.prevent="removeFile(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-4 p-0">
            <div class="card-block claim-info">
              <div class="card-header">
                <h3 class="card-title">Thông tin</h3>
              </div>
              <div class="card-content">
                <div class="row m-0 mb-8">
                  <span class="col-4 p-0">LB tracking:</span>
                  <span class="col-8 p-0"
                    ><router-link
                      class="text-no-underline"
                      :to="{
                        name: 'package-detail',
                        params: { id: claim.object_id },
                      }"
                      >{{ claim.package_code }}</router-link
                    ></span
                  >
                </div>
                <div class="row m-0 mb-8">
                  <span class="col-4 p-0">Ngày tạo:</span>
                  <span class="col-8 p-0">{{
                    claim.created_at | datetime('dd/MM/yyyy')
                  }}</span>
                </div>
                <div class="row m-0 mb-8">
                  <span class="col-4 p-0">Lý do:</span>
                  <span class="col-8 p-0">{{ reason }}</span>
                </div>
                <div class="row m-0 mb-5">
                  <span class="col-4 p-0">Trạng thái:</span>
                  <span
                    class="col-8 p-0"
                    v-status="claim.status"
                    type="claim"
                  ></span>
                </div>
                <button
                  class="btn btn-outline-info w-100"
                  v-if="!isClosed"
                  @click="handleCloseTicket()"
                  >Đóng khiếu nại</button
                >
              </div>
            </div>
            <div class="card-block card-attachments">
              <div class="card-header">
                <h3 class="card-title">Tài liệu đính kèm</h3>
              </div>
              <div class="card-content pr-0">
                <div v-if="attachments.length" class="claim-attachments">
                  <p
                    class="item d-flex"
                    v-for="(item, i) in attachments"
                    :key="i"
                  >
                    <file :src="item.src" :name="item.name">
                      <i class="icon center">
                        <img src="~@/assets/img/download.svg" />
                      </i>
                    </file>
                    <span>
                      {{ item.name }}
                      <time>{{
                        item.created_at | date('dd/MM/yyyy hh:mm aa')
                      }}</time>
                    </span>
                  </p>
                </div>
                <template v-else>
                  <div class="text-center p-5">
                    <img src="~@/assets/img/empty.svg" alt="" />
                    <p>Chưa có file đính kèm</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NotFound v-else></NotFound>
    </div>
  </div>
</template>

<script>
import mixinUpload from '@core/mixins/upload'
import File from '../components/File'
import { mapActions, mapState, mapMutations } from 'vuex'
import Message from '../components/Message'
import NotFound from '../../../components/shared/NotFound'
import {
  UPDATE_TICKET,
  UPDATE_FILE_TICKET,
  CANCEL_TICKET,
  FETCH_MESSAGE,
  GET_FILE_TICKET,
  PUSH_MESSAGE,
  UPDATE_MESSAGE_TICKET,
} from '../store'
import { FETCH_TICKET } from '@/packages/claim/store'
import {
  CLAIM_STATUS_PROCESSED,
  CLAIM_STATUS_TEXT,
  MAP_REASON_CATEGORY_TEXT,
  REASON_CATEGORY_OTHER_TEXT,
} from '../constants'
import { truncate } from '@core/utils/string'
import { Upload } from '@kit'
import { MAXIMUM_SIZE } from '../constants'
import { cloneDeep } from '../../../core/utils'
import { datetime, format } from '../../../core/utils/datetime'

const regexName = /_\w{8}-\w{4}-\w{4}-\w{4}-\w{12}.(xlsx|jpg|png|jpeg)$/gi

export default {
  name: 'ClaimDetail',
  mixins: [mixinUpload],
  components: {
    File,
    Message,
    Upload,
    NotFound,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      isUploading: false,
      filter: {
        limit: 50,
        last_id: 0,
        next: true,
      },
      message: '',
      lengthContent: false,
      fileErrors: [],
      maximumSize: MAXIMUM_SIZE * 2 ** 20,
      allowedTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      allowedExtensions: /(\.jpg|\.jpeg|\.png|\.xlsx|\.xls)$/i,
      countIsUploading: 0,
      isFistScroll: false,
      isMessageFetching: false,
    }
  },
  computed: {
    ...mapState('claim', {
      claim: (state) => state.ticket,
      messages: (state) => state.message,
    }),

    isEmpty() {
      return !this.claim || !this.claim.id
    },

    reason() {
      const cat = this.claim.category
      return MAP_REASON_CATEGORY_TEXT[cat] || REASON_CATEGORY_OTHER_TEXT
    },

    statusText() {
      const status = this.claim.status || 0
      return CLAIM_STATUS_TEXT[status] || 'Unknown'
    },

    isClosed() {
      return this.claim.status == CLAIM_STATUS_PROCESSED
    },

    attachments() {
      const attachments = []

      if (this.messages && this.messages.length) {
        for (const message of this.messages) {
          const files = (message.attachment || []).map((src) => ({
            src,
            name: src
              .replace(regexName, `.$1`)
              .split('/')
              .pop(),
            created_at: message.created_at,
          }))

          attachments.push(...files)
        }
      }

      const files = (this.claim.attachment || []).map((src) => ({
        src,
        name: src
          .replace(regexName, `.$1`)
          .split('/')
          .pop(),
        created_at: this.claim.created_at,
      }))

      attachments.push(...files)
      return attachments
    },

    ticketID() {
      return parseInt(this.$route.params.id)
    },

    displayMessages() {
      let last = null
      const results = []
      let messages = [...(this.messages || [])]
      messages.reverse()

      const now = format(new Date(), 'yyyyMMdd')
      const nowYear = format(new Date(), 'yyyy')

      for (const message of messages) {
        const dd = datetime(message.created_at, 'yyyyMMdd')

        if (last) {
          if (last.user_id != message.user_id) {
            results.push(last)
            last = null
          } else if (last.dd != dd) {
            results.push(last)
            last = null
          }
        }

        if (!last) {
          last = cloneDeep(message)
          last.dd = dd
        }

        last.datetime = datetime(last.created_at, 'dd/MM hh:mm aa')
        if (now == dd) {
          last.datetime = datetime(last.created_at, 'hh:mm aa')
        } else if (nowYear != datetime(message.created_at, 'yyyy')) {
          last.datetime = datetime(last.created_at, 'dd/MM/yyyy hh:mm aa')
        }

        if (last.items) {
          last.items.push(message.content)
        } else {
          last.items = [message.content]
        }
      }

      if (last) {
        results.push(last)
      }

      return results
    },
  },

  created() {
    this.init()
  },

  updated() {
    this.$nextTick(function() {
      this.flexContent()

      if (!this.isFistScroll) {
        setTimeout(() => {
          this.isFistScroll = true
          this.scrollHandle()
        }, 100)
      }
    })
  },

  methods: {
    truncate,
    ...mapMutations('claim', [UPDATE_MESSAGE_TICKET]),
    ...mapActions('claim', [
      FETCH_TICKET,
      UPDATE_FILE_TICKET,
      UPDATE_TICKET,
      CANCEL_TICKET,
      FETCH_MESSAGE,
      GET_FILE_TICKET,
      PUSH_MESSAGE,
    ]),

    async init() {
      this[UPDATE_MESSAGE_TICKET]([])
      await Promise.all([
        this[FETCH_TICKET](this.ticketID),
        this.handlerFetchTicketMessages(),
      ])
    },

    scrollHandle() {
      const $el = document.querySelector('#box-message')
      const $messages = document.querySelector('#box-message .list-messages')
      const height = $messages.offsetHeight || 0

      $el.scrollTop = height
    },

    onscroll(e) {
      if (e.target.scrollTop < 50) {
        this.handlerFetchTicketMessages()
      }
    },

    async handlerFetchTicketMessages() {
      if (!this.filter.next || this.isMessageFetching) return

      if (this.messages.length) {
        const n = this.messages.length - 1
        this.filter.last_id = this.messages[n].id || 0
      }

      let { limit, last_id } = this.filter
      if (last_id == 1) {
        this.filter.next = false
        return
      }

      this.isMessageFetching = true

      const res = await this[FETCH_MESSAGE]({
        ticket_id: this.ticketID,
        limit,
        last_id,
      })

      this.isMessageFetching = false

      if (res.error) return
      if (res.messages.length < 1) {
        this.filter.next = false
      }
    },

    listenChange(files) {
      this.fileErrors = []
      this.countIsUploading += files.length || 0
    },

    handleChangeFile(file) {
      const index = this.files.findIndex(({ uid }) => uid === file.uid)
      if (index !== -1) {
        this.$set(this.files, index, file)
      }

      if (this.validateTypeFile(file)) {
        this.handleUploadFile(file)
        return
      }

      this.countIsUploading--
      this.fileErrors.push(
        `"${file.name}" định dạng không đúng.Tệp phải có định dạng:  *XLSX, *PNG, *JPG, *JPEG.`
      )
      this.fileErrors = [...new Set(this.fileErrors)]
    },

    async handleUploadFile(file) {
      let body = { file: file.raw }

      this.isUploading = true
      const res = await this[UPDATE_FILE_TICKET](body)

      if (res.error) {
        this.isUploading = false
        this.fileErrors.push(res.message)
        return
      }

      this.files.push({
        url: res.urls,
        uid: file.uid,
        name: file.name,
      })

      this.countIsUploading--
      if (this.countIsUploading < 1) {
        this.isUploading = false
      }
    },

    async handleReply() {
      if (this.isUploading) return

      const validate = await this.$validator.validateAll()

      if (!validate) return
      if (this.lengthContent) return

      const urls = this.files.map(({ url }) => url)
      const form = {
        ticket_id: this.claim.id,
        content: this.message,
        urls: urls || [],
      }

      this.isUploading = true
      const res = await this[PUSH_MESSAGE](form)
      this.isUploading = false

      if (!res.success) {
        this.$toast.error(res.message)
        return
      }

      this.message = ''
      this.files = []
      this.fileErrors = []
      this.countIsUploading = 0
      this.scrollHandle()
      this.$nextTick(() => {
        this.errors.clear()
        this.$validator.reset()
      })
    },

    removeFile(file) {
      this.$dialog.confirm({
        title: 'Xóa files',
        message: 'Bạn có thực sự muốn xóa file này ?',
        type: 'danger',
        typeCancel: 'default',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        onConfirm: () => {
          this.files = this.files.filter(({ uid }) => uid != file.uid)
        },
      })
    },

    async handleCloseTicket() {
      const res = await this[CANCEL_TICKET]({ id: this.claim.id })
      if (res.error) {
        this.$toast.error(res.message)
        return
      }

      this.$toast.success('Đóng khiếu nại thành công')
      this.files = []

      await this[FETCH_TICKET](this.ticketID)
    },

    errorMaximum({ name }) {
      this.countIsUploading--
      this.fileErrors.push(
        `"${name}" đang lớn hơn 5Mb.Vui lòng chọn tệp nhỏ hơn.`
      )
    },

    validateTypeFile(file) {
      if (this.allowedExtensions.exec(file.name)) {
        return true
      }

      if (this.allowedTypes.includes(file.raw.type)) {
        return true
      }

      return false
    },

    flexContent() {
      const $content = document.querySelector('.claim-content')
      const $message = document.querySelector('.claim-messages')
      const $reply = document.querySelector('.claim-reply')

      if (!$content || !$reply || !$message) return

      const winHeight = window.innerHeight
      const contentHeight = $content.offsetHeight || 0
      const replyHeight = $reply.offsetHeight || 0

      let messageHeight = winHeight - contentHeight - replyHeight
      messageHeight = messageHeight < 300 ? 300 : messageHeight
      $message.style.height = messageHeight + 'px'
    },
  },
  watch: {
    $route: function() {
      this.init()
    },
  },
}
</script>
