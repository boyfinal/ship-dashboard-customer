<template>
  <p-modal
    id="preview"
    :active="visible"
    title="Nhập Excel"
    @close="handleClose"
  >
    <table class="mb-10 table-result">
      <tr>
        <td>
          Kết quả:
        </td>
        <td>
          <div v-if="importErrors.length === 0">
            <i class="success-import"></i>
            <span>Thành công</span>
          </div>
          <div v-else>
            <i class="fail-import"></i>
            <span>Thất bại</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          Tổng số đơn:
        </td>
        <td> {{ total }} đơn </td>
      </tr>
      <tr>
        <td>
          Đơn thành công:
        </td>
        <td> {{ importSucess }} đơn </td>
      </tr>
    </table>

    <div class="detail" v-if="importErrors && importErrors.length">
      <p>Chi tiết:</p>
      <table class="table-error">
        <thead>
          <tr>
            <th>Dòng</th>
            <th>Giá trị gốc</th>
            <th>Nguyên nhân</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(error, i) in importErrors" :key="i">
            <td>{{ error.line }}</td>
            <td>
              <pre>{{ error.value.join('\n') }}</pre>
            </td>
            <td>
              <pre>{{ error.messages.join('') }}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </p-modal>
</template>

<script>
export default {
  name: 'ModalImportPreviewPackage',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    importSucess: {
      type: Number,
      default: 0,
    },
    importErrors: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
}
</script>
