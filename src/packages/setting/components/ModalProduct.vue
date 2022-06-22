<template>
  <div class="modal__add-claim">
    <p-modal :active="visible" @close="handleClose" :title="title">
      <template>
        <div class="row mb-18">
          <div class="col-12">
            <label class="modal__add-claim-label"
              >Tên sản phẩm: <span>*</span></label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tên sản phẩm"
              v-validate="'required'"
              name="name"
              v-model="productEdit.name"
              data-vv-as="Tên sản phẩm"
              :class="{ 'error-color': errors.has('name') }"
            />
            <span class="err-span" v-if="errors.has('name')">{{
              errors.first('name')
            }}</span>
          </div>
        </div>

        <div class="row mb-18">
          <div class="col-12">
            <label class="modal__add-claim-label">SKU: <span>*</span></label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập sku"
              v-validate="'required'"
              name="sku"
              v-model="productEdit.sku"
              data-vv-as="SKU"
              :class="{ 'error-color': errors.has('sku') }"
            />
            <span class="err-span" v-if="errors.has('sku')">{{
              errors.first('sku')
            }}</span>
          </div>
        </div>

        <div class="row mb-18">
          <div class="col-12">
            <label class="modal__add-claim-label">Loại sản phẩm:</label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập loại sản phẩm"
              v-model="productEdit.detail"
            />
          </div>
        </div>

        <div class="row mb-18">
          <div class="col-12">
            <label class="modal__add-claim-label">Chất liệu sản phẩm:</label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập chất liệu sản phẩm"
              v-model="productEdit.material"
            />
          </div>
        </div>

        <div class="row mb-18">
          <div class="col-12 size">
            <label class="modal__add-claim-label">Trọng lượng:</label>
            <input
              type="number"
              class="form-control"
              placeholder="Nhập trọng lượng"
              v-model="productEdit.weight"
              name="weight"
              min="0"
              v-validate="'min:0'"
              :class="{ 'error-color': errors.has('weight') }"
            />
            <div class="card__w-unit">gram</div>
          </div>
          <span class="err-span" v-if="errors.has('weight')">{{
            errors.first('weight')
          }}</span>
        </div>

        <div class="row mb-8">
          <div class="col-4 size">
            <label class="modal__add-claim-label">Dài:</label>
            <input
              type="number"
              class="form-control"
              placeholder="Nhập chiều dài"
              v-model="productEdit.length"
              min="0"
              name="length"
              v-validate="'min:0'"
              :class="{ 'error-color': errors.has('length') }"
            />
            <div class="card__w-unit">cm</div>
            <span class="err-span" v-if="errors.has('length')">{{
              errors.first('length')
            }}</span>
          </div>

          <div class="col-4 size">
            <label class="modal__add-claim-label">Rộng:</label>
            <input
              type="number"
              class="form-control"
              placeholder="Nhập chiều rộng"
              v-model="productEdit.width"
              name="width"
              min="0"
              v-validate="'min:0'"
              :class="{ 'error-color': errors.has('width') }"
            />
            <div class="card__w-unit">cm</div>
            <span class="err-span" v-if="errors.has('width')">{{
              errors.first('width')
            }}</span>
          </div>

          <div class="col-4 size">
            <label class="modal__add-claim-label">Cao:</label>
            <input
              type="number"
              class="form-control"
              placeholder="Nhập chiều cao"
              v-model="productEdit.height"
              name="height"
              min="0"
              v-validate="'min:0'"
              :class="{ 'error-color': errors.has('height') }"
            />
            <div class="card__w-unit">cm</div>
            <span class="err-span" v-if="errors.has('height')">{{
              errors.first('height')
            }}</span>
          </div>
        </div>
      </template>

      <template slot="footer">
        <div></div>
        <div class="d-flex">
          <div>
            <p-button @click="handleClose" type="default"> Hủy </p-button>
          </div>
          <div class="ml-7">
            <p-button type="primary" @click="handleSave"> Lưu </p-button>
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalProduct',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    product: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      productEdit: {
        name: '',
        sku: '',
        detail: '',
        material: '',
        weight: '',
        length: '',
        width: '',
        height: '',
      },
    }
  },
  methods: {
    async handleSave() {
      const validate = await this.$validator.validateAll()
      if (!validate) {
        return
      }

      const data = {
        name: this.productEdit.name.trim(),
        sku: this.productEdit.sku.trim(),
      }

      if (this.productEdit.detail) {
        data.detail = this.productEdit.detail.trim()
      }
      if (this.productEdit.material) {
        data.material = this.productEdit.material.trim()
      }
      if (this.productEdit.weight) {
        data.weight = +this.productEdit.weight
      }
      if (this.productEdit.length) {
        data.length = +this.productEdit.length
      }
      if (this.productEdit.width) {
        data.width = +this.productEdit.width
      }
      if (this.productEdit.height) {
        data.height = +this.productEdit.height
      }
      if (this.productEdit.id > 0) {
        data.id = this.productEdit.id
      }

      this.$emit('saveProduct', data)
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close', true)
    },
  },
  watch: {
    visible: {
      handler: function() {
        if (this.visible) {
          this.productEdit = Object.assign({}, this.product)
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
.modal__add-claim {
  .size {
    position: relative;
  }
}
.err-span {
  margin: 0px 5px 0 10px;
}
</style>
