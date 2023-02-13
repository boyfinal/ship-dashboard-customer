<template>
  <p-modal
    :active="visible"
    :title="title"
    @close="handleClose"
    :disable-close="isLoading"
  >
    <template v-if="isLoading">
      <div class="text-center processing">
        <p>Quá trình nhập file excel có thể sẽ mất một vài phút ...</p>
        <img src="~@/assets/img/loading.gif" />
      </div>
    </template>
    <template v-else>
      <template v-if="result">
        <div class="result-error" v-if="result.error">
          <p>Phát hiện có {{ result.errors.length }} lỗi:</p>
          <table class="table table-error">
            <thead>
              <tr>
                <th>Dòng</th>
                <th>Giá trị gốc</th>
                <th>Nguyên nhân</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in result.errors" :key="i">
                <td>{{ item.line || '-' }}</td>
                <td>{{ item.value }}</td>
                <td>{{ item.message }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="result-success" v-else>
          <table class="mb-10 table-result">
            <tr>
              <td>Tổng số đơn:</td>
              <td> {{ result.total }} đơn </td>
            </tr>
            <tr>
              <td>Đơn thành công:</td>
              <td> {{ result.total_success }} đơn </td>
            </tr>
          </table>
        </div>
      </template>
      <template v-else>
        <div align="center">
          <span class="example">
            Tải về file <a :href="csvTemplate" target="_blank">mẫu XLSX</a>
          </span>
          <upload
            class="order-uploader"
            :action="createEndpoint(`packages/import`)"
            drag
            :auto-upload="false"
            :headers="uploadHeaders"
            :on-change="handleChangeFile"
            :on-max-size="errorSizeFileHandler"
            :max-file-size="2048000"
          >
            <img class="el-icon-upload" src="~@/assets/img/upload.png" alt="" />
            <div class="el-upload__text">
              Kéo thả file để upload hoặc <em>tải lên</em>
            </div>
            <div v-if="!file" class="el-before-upload__text">
              Chưa có file nào được chọn .
            </div>
            <div v-else class="el-before-upload__text">
              {{ file.name }}
            </div>
          </upload>
        </div>
      </template>
    </template>
    <template slot="footer">
      <div class="rule" v-show="!result">
        <img
          style="margin-bottom: 3px"
          src="@/assets/img/InfoCircle.svg"
          alt="alert"
        />
        <i
          ><b>Lưu ý:</b>Định dạng file hợp lệ là XLSX và có dung lượng dưới
          2Mb.</i
        >
      </div>
      <div class="group-button">
        <p-button
          type="default"
          @click="handleCloseSuccess"
          :disabled="isLoading"
          v-show="result && !result.error"
        >
          Đóng
        </p-button>
        <p-button
          type="default"
          @click="handleClose"
          :disabled="isLoading"
          v-show="!result || result.error"
        >
          Bỏ qua
        </p-button>
        <p-button
          type="default"
          @click="handleReupload"
          :disabled="isLoading"
          v-show="result && result.error"
        >
          Tải lại
        </p-button>
        <p-button
          type="primary"
          @click.prevent="handleUpload"
          :disabled="disabled"
          :loading="isLoading"
          v-show="!result"
        >
          Tải lên
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<script>
import mixinRoute from '@core/mixins/route'
import mixinTable from '@core/mixins/table'
import mixinUpload from '@core/mixins/upload'
import { Upload } from '@kit/index'
import { mapActions } from 'vuex'
import { IMPORT_ORDER } from '../../store'

export default {
  name: 'ModalImport',
  mixins: [mixinRoute, mixinTable, mixinUpload],
  components: { Upload },
  props: {
    title: {
      type: String,
      default: 'Import Orders',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: null,
      isLoading: false,
      result: null,
    }
  },
  computed: {
    csvTemplate() {
      return `${process.env.VUE_APP_ASSETS}/lionbay_order_template.xlsx`
    },
    disabled() {
      return !this.file || this.isLoading
    },
  },
  methods: {
    ...mapActions('order', { importOrder: IMPORT_ORDER }),
    handleClose() {
      if (this.isLoading) return

      if (this.result && !this.result.error) {
        this.$emit('success', this.result)
      }

      this.file = null
      this.result = null
      this.$emit('update:visible', false)
    },
    errorSizeFileHandler() {
      this.$toast.error('File upload vượt quá dung lượng cho phép')
    },
    customLabel({ name }) {
      return name
    },
    async handleUpload() {
      if (this.isLoading) return

      this.isLoading = true

      const form = new FormData()
      form.append('file', this.file.raw)
      const res = await this.importOrder(form)

      this.isLoading = false

      if (res.error && !res.errors) {
        this.$toast.error(res.message)
        return
      }

      this.result = res
    },
    handleCloseSuccess() {
      this.$emit('success', this.result)
      this.$emit('update:visible', false)
      this.file = null
      this.result = null
    },
    handleChangeFile(file) {
      this.file = file
    },
    handleReupload() {
      this.file = null
      this.result = null
    },
  },
}
</script>
