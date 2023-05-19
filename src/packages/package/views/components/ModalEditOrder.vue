<template>
  <div class="modal__edit-order">
    <p-modal :active="visible" @close="handleClose" :title="`Sửa đơn`">
      <template>
        <div class="modal__edit-order-header">
          <img
            style="margin-bottom: 3px"
            src="@/assets/img/InfoCircle.svg"
            alt="alert"
          />
          <b>Lưu ý:</b> <i>(<span>*</span>) Là các trường bắt buộc nhập.</i>
        </div>
        <div class="modal__edit-order-content">
          <div class="row sm-gutters flex-nowrap">
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header"> Người nhận </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Họ và tên: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="vd. Nguyen Van A"
                        type="fullname"
                        validate="on"
                        v-model="fullname"
                        :input="fullname"
                        class="form-control"
                        v-validate="'required'"
                        name="name"
                        data-vv-as="Tên"
                        :class="{ 'error-color': errors.has('name') }"
                      />
                      <span class="err-span" v-if="errors.has('name')">{{
                        errors.first('name')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Điện thoại: </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập số điện thoại"
                        type="phonenumber"
                        ref="email"
                        v-model="phone"
                        :input="phone"
                        class="form-control"
                        v-validate="'phoneAddress'"
                        name="phone"
                        data-vv-as="Số điện thoại"
                        :class="{ 'error-color': errors.has('phone') }"
                      />
                      <span class="err-span" v-if="errors.has('phone')">{{
                        errors.first('phone')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Thành phố: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập thành phố"
                        type="text"
                        v-model="city"
                        :input="city"
                        class="form-control"
                        v-validate="'required'"
                        name="city"
                        data-vv-as="Thành phố"
                        :class="{ 'error-color': errors.has('city') }"
                      />
                      <span class="err-span" v-if="errors.has('city')">{{
                        errors.first('city')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Địa chỉ: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập địa chỉ"
                        type="text"
                        v-model="address"
                        :input="address"
                        class="form-control"
                        v-validate="'required|address'"
                        name="address"
                        data-vv-as="Địa chỉ"
                        :class="{ 'error-color': errors.has('address') }"
                      />
                      <span class="err-span" v-if="errors.has('address')">{{
                        errors.first('address')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Địa chỉ phụ: </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập địa chỉ phụ"
                        type="text"
                        v-model="address2"
                        :input="address2"
                        class="form-control"
                        v-validate="'address'"
                        name="address2"
                        data-vv-as="Địa chỉ phụ"
                        :class="{ 'error-color': errors.has('address2') }"
                      />
                      <span class="err-span" v-if="errors.has('address2')">{{
                        errors.first('address2')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã vùng<br />
                      (state): <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập mã vùng"
                        type="text"
                        class="form-control"
                        v-model="state"
                        :input="state"
                        v-validate="'required|state'"
                        name="state"
                        data-vv-as="Mã vùng"
                        :class="{ 'error-color': errors.has('state') }"
                      />
                      <span class="err-span" v-if="errors.has('state')">{{
                        errors.first('state')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã bưu điện: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập mã bưu điện"
                        type="text"
                        v-model="postcode"
                        :input="postcode"
                        class="form-control"
                        v-validate="'required|postcode'"
                        name="postcode"
                        data-vv-as="Mã bưu điện"
                        :class="{ 'error-color': errors.has('postcode') }"
                      />
                      <span class="err-span" v-if="errors.has('postcode')">{{
                        errors.first('postcode')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã quốc gia: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập mã quốc gia"
                        type="text"
                        v-model="countrycode"
                        :input="countrycode"
                        class="form-control"
                        v-validate="'required|countrycode'"
                        name="countrycode"
                        data-vv-as="Mã quốc gia"
                        :class="{ 'error-color': errors.has('countrycode') }"
                      />
                      <span class="err-span" v-if="errors.has('countrycode')">{{
                        errors.first('countrycode')
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div
                  class="card__w-header d-flex justify-content-between align-items-center"
                >
                  Sản phẩm
                  <div class="add-product">
                    <a @click="handleAddProduct" class="btn btn-add">
                      <img src="~@assets/img/Add 20px.png" />
                    </a>
                  </div>
                </div>

                <div class="card__w-content pr-13 pl-13">
                  <div class="card__w-item">
                    <div class="card__w-input ml-0">
                      <div
                        class="d-flex product-item"
                        v-for="(prod, index) in package_prods"
                        :key="index"
                      >
                        <div class="row product-info">
                          <div class="select-product col-md-7 ">
                            <multiselect
                              class="multiselect-custom dropdown-reason"
                              v-model="product_sku[index]"
                              :options="product_option"
                              placeholder="Chọn SKU"
                              @select="handleSelectProd($event, index)"
                              @remove="handleRemoveProd($event, index)"
                              :custom-label="customLabelProd"
                            ></multiselect>
                          </div>
                          <div class="select-product col-md-5">
                            <div class="product-name">
                              {{ prod.name }}
                            </div>
                          </div>
                          <span class="err-span" v-if="prod.err != ''">
                            {{ prod.err }}
                          </span>
                        </div>

                        <input
                          placeholder="Số lượng"
                          v-model="prod.quantity"
                          :input="prod.quantity"
                          class="form-control select-product product-quantity"
                          name="quantity"
                          :class="{ 'error-color': errors.has('name') }"
                        />
                        <div
                          class="add-product"
                          v-if="package_prods.length > 0"
                        >
                          <a
                            @click="handleRemoveProduct(index)"
                            class="btn btn-remove"
                          >
                            <img src="~@assets/img/X 20px.png" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header"> Chi tiết đơn hàng </div>
                <div class="card__w-content">
                  <div class="card__w-item" v-if="false">
                    <label class="card__w-label"> Danh sách sản phẩm: </label>
                    <div class="card__w-input">
                      <multiselect
                        class="multiselect-custom dropdown-reason"
                        v-model="item"
                        :options="product_option"
                        placeholder="Chọn SKU"
                        @select="handleSelect"
                        :custom-label="customLabel"
                        @remove="handleRemove"
                      ></multiselect>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Mã đơn hàng : <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập mã đơn hàng"
                        type="text"
                        v-model="order_number"
                        :input="order_number"
                        class="form-control"
                        v-validate="'required'"
                        name="order_number"
                        data-vv-as="Mã đơn hàng"
                        :class="{ 'error-color': errors.has('order_number') }"
                      />
                      <span
                        class="err-span"
                        v-if="errors.has('order_number')"
                        >{{ errors.first('order_number') }}</span
                      >
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Chi tiết sản phẩm : <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập chi tiết sản phẩm"
                        type="text"
                        v-model="detail"
                        :input="detail"
                        class="form-control"
                        v-validate="'required'"
                        name="detail"
                        data-vv-as="Chi tiết sản phẩm"
                        :class="{ 'error-color': errors.has('detail') }"
                      />
                      <span class="err-span" v-if="errors.has('detail')">{{
                        errors.first('detail')
                      }}</span>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Trọng lượng: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập trọng lượng"
                        type="text"
                        v-model="weight"
                        :input="weight"
                        class="form-control"
                        v-validate="'required|weight'"
                        name="weight"
                        data-vv-as="Trọng lượng"
                        :disabled="isDisable"
                        :class="{ 'error-color': errors.has('weight') }"
                      />
                      <span class="err-span" v-if="errors.has('weight')">{{
                        errors.first('weight')
                      }}</span>
                      <div class="card__w-unit">gram</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Dài: <span>*</span> </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập chiều dài "
                        type="text"
                        v-model="length"
                        :input="length"
                        class="form-control"
                        v-validate="'required|length'"
                        name="length"
                        data-vv-as="Chiều dài"
                        :disabled="isDisable"
                        :class="{ 'error-color': errors.has('length') }"
                      />
                      <span class="err-span" v-if="errors.has('length')">{{
                        errors.first('length')
                      }}</span>
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Rộng: <span>*</span> </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập chiều rộng "
                        type="text"
                        v-model="width"
                        :input="width"
                        class="form-control"
                        v-validate="'required|width'"
                        name="width"
                        :disabled="isDisable"
                        data-vv-as="Chiều rộng"
                        :class="{ 'error-color': errors.has('width') }"
                      />
                      <span class="err-span" v-if="errors.has('width')">{{
                        errors.first('width')
                      }}</span>
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Cao: <span>*</span> </label>
                    <div class="card__w-input">
                      <input
                        placeholder="Nhập chiều cao "
                        type="text"
                        v-model="height"
                        :input="height"
                        class="form-control"
                        v-validate="'required|height'"
                        name="height"
                        :disabled="isDisable"
                        data-vv-as="Chiều cao"
                        :class="{ 'error-color': errors.has('height') }"
                      />
                      <span class="err-span" v-if="errors.has('height')">{{
                        errors.first('height')
                      }}</span>
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label"> Hàng có pin </label>
                    <div class="card__w-input">
                      <p-checkbox v-model="include_battery"></p-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header"> Dịch vụ gửi </div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">
                      Dịch vụ gửi: <span>*</span>
                    </label>
                    <div class="card__w-input">
                      <multiselect
                        class="multiselect-custom dropdown-reason"
                        v-model="service"
                        :options="services"
                        placeholder="Chọn một "
                        :allow-empty="false"
                        @select="handleSelectService"
                        :custom-label="customLabel"
                      ></multiselect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="modal__edit-order-footer">
          <div class="total-title">
            Tổng cước:
            <span class="total-number">{{ 0 | formatPrice }}</span>
            <div class="text">Bảng giá không áp dụng cho hành trình này!</div>
          </div>
          <div class="divider">
            <div class="notch"></div>
            <div class="notch-bt"></div>
          </div>
          <div class="total-action">
            <p-button :type="`default`" class="btn" @click="handleClose"
              >Hủy bỏ</p-button
            >
            <p-button
              class="btn btn-primary"
              :disabled="isUpdate"
              @click="handleUpdate"
              >Cập nhật</p-button
            >
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { GET_SERVICE, UPDATE_PACKAGE } from '../../store'
import { LIST_PRODUCT } from '../../../setting/store'
import { cloneDeep } from '@core/utils'

export default {
  name: 'ModalEditOrder',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('package', {
      package_detail: (state) => state.package_detail,
      products: (state) => state.products,
    }),
    ...mapState('setting', {
      listProducts: (state) => state.products,
    }),
    ...mapGetters('package', {
      services: GET_SERVICE,
    }),
    current() {
      return this.package_detail.package || {}
    },
  },
  data() {
    return {
      item: null,
      sender: null,
      service: {
        id: 0,
        name: '',
      },
      fullname: '',
      phone: '',
      city: '',
      state: '',
      postcode: '',
      note: '',
      code: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      countrycode: '',
      order_number: '',
      detail: '',
      address: '',
      include_battery: false,
      isDisable: false,
      address2: '',
      isUpdate: false,
      package_prods: [],
      product_sku: [],
      selected_prod: [],
      product_option: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('package', { updatePackage: UPDATE_PACKAGE }),
    ...mapActions('setting', [LIST_PRODUCT]),

    async init() {
      let result = await this.listProduct()
      if (!result.success) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }
      this.product_option = cloneDeep(this.listProducts)
      this.fullname = this.current.recipient
      this.phone = this.current.phone_number
      this.city = this.current.city
      this.state = this.current.state_code
      this.postcode = this.current.zipcode
      this.note = this.current.note || 'Không có yêu cầu'
      this.code = this.current.code
      this.items = this.current.items
      this.weight = this.current.weight
      this.length = this.current.length
      this.width = this.current.width
      this.height = this.current.height
      this.countrycode = this.current.country_code
      this.address = this.current.address_1
      this.address2 = this.current.address_2
      this.order_number = this.current.order_number
      this.detail = this.current.detail
      this.package_prods = []
      this.product_sku = []
      this.include_battery = this.current.include_battery

      if (this.current.package_products) {
        for (let i = 0; i < this.current.package_products.length; i++) {
          let prod = this.listProducts.find(
            (prod) => prod.id == this.current.package_products[i].product_id
          )

          this.package_prods.push({
            product_id: this.current.package_products[i].product_id,
            sku: prod.sku,
            quantity: this.current.package_products[i].quantity,
            name: prod.name,
            err: '',
          })

          this.product_sku.push(prod)

          let index = this.product_option.findIndex((ele) => ele.id == prod.id)
          if (index >= 0) {
            this.product_option.splice(index, 1)
          }
        }
      }

      this.package_prods.push({
        product_id: 0,
        sku: 'Chọn SKU',
        quantity: '',
        name: 'Tên sản phẩm',
        err: '',
      })

      this.product_sku.push({
        product_id: 0,
        sku: 'Chọn SKU',
        quantity: '',
        name: 'Tên sản phẩm',
      })

      this.service = {
        id: this.current.service_id ? this.current.service_id : 0,
        name: this.current.service_name ? this.current.service_name : '',
      }
    },

    handleSelectProd(value, index) {
      let i = this.listProducts.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.listProducts[i])
      }

      i = this.product_option.findIndex((ele) => ele.id == value.id)
      if (i >= 0) {
        this.product_option.splice(i, 1)
      }
      this.package_prods[index].product_id = value.id
      this.package_prods[index].sku = value.sku
      this.package_prods[index].name = value.name
      this.product_sku[index] = value
    },

    handleRemoveProd(value, index) {
      let i = this.listProducts.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.listProducts[i])
      }
      this.package_prods[index].product_id = 0
      this.package_prods[index].sku = 'Chọn SKU'
      this.package_prods[index].quantity = ''
      this.package_prods[index].name = 'Tên sản phẩm'
    },

    customLabelProd(item) {
      return item.sku
    },

    handleClose() {
      this.fullname = ''
      this.phone = ''
      this.city = ''
      this.state = ''
      this.postcode = ''
      this.note = ''
      this.code = ''
      this.items = ''
      this.weight = ''
      this.length = ''
      this.width = ''
      this.height = ''
      this.countrycode = ''
      this.service = ''
      this.address = ''
      this.include_battery = false
      this.package_prods = []
      this.product_sku = []
      this.$validator.pause()

      this.$nextTick(() => {
        this.$validator.errors.clear()
        this.$validator.fields.items.forEach((field) => field.reset())
        this.$validator.fields.items.forEach((field) =>
          this.errors.remove(field)
        )
        this.$validator.resume()
      })

      this.$emit('update:visible', false)
    },

    customLabel(item) {
      return item.name
    },

    handleSelect(value) {
      this.width = value.width
      this.height = value.height
      this.weight = value.weight
      this.length = value.length
      this.isDisable = true
    },
    handleSelectService(value) {
      this.service = value
    },

    handleRemove() {
      this.isDisable = false
      this.weight = this.current.weight
      this.length = this.current.length
      this.width = this.current.width
      this.height = this.current.height
    },

    async handleUpdate() {
      const validate = await this.$validator.validateAll()

      let invalidProd = true

      const regex = new RegExp(/^[0-9]{1,4}$/)

      for (let i = 0; i < this.package_prods.length; i++) {
        this.package_prods[i].quantity = String(
          this.package_prods[i].quantity
        ).trim()

        if (
          (this.package_prods[i].product_id < 1 &&
            this.package_prods[i].quantity != '') ||
          (this.package_prods[i].quantity == '' &&
            this.package_prods[i].product_id > 0)
        ) {
          this.package_prods[i].err =
            'Vui lòng chọn SKU và nhập số lượng sản phẩm'
          invalidProd = false
          continue
        }

        if (
          (!regex.test(this.package_prods[i].quantity) ||
            this.package_prods[i].quantity < 1) &&
          this.package_prods[i].quantity != ''
        ) {
          this.package_prods[i].err = 'Số lượng sản phẩm không hợp lệ'
          invalidProd = false
          continue
        }

        this.package_prods[i].err = ''
      }

      let package_products = []

      this.package_prods
        .filter((prod) => prod.product_id > 0 && prod.err == '')
        .forEach((prod) => {
          package_products.push({
            product_id: prod.product_id,
            quantity: parseInt(prod.quantity),
          })
        })

      if (!invalidProd || !validate) {
        return
      }

      this.isUpdate = true
      const { id } = this.$route.params
      const params = {
        id: parseInt(id),
        recipient: this.fullname,
        phone: this.phone.trim(),
        address_1: this.address,
        city: this.city,
        state_code: this.state,
        zipcode: this.postcode,
        country_code: this.countrycode,
        detail: this.detail,
        order_number: this.order_number,
        weight: +this.weight,
        width: +this.width,
        length: +this.length,
        height: +this.height,
        service: this.service.name,
        note: this.note,
        address_2: this.address2,
        include_battery: this.include_battery,
        package_products: package_products,
      }

      let result = await this.updatePackage(params)
      this.isUpdate = false

      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.$toast.success('Sửa đơn thành công', { duration: 3000 })
      this.handleClose()
      this.$emit('create', true)
    },

    handleAddProduct() {
      this.package_prods.push({
        product_id: 0,
        sku: 'Chọn SKU',
        quantity: '',
        name: 'Tên sản phẩm',
        err: '',
      })

      this.product_sku.push({
        product_id: 0,
        sku: 'Chọn SKU',
        quantity: '',
        name: 'Tên sản phẩm',
      })
    },

    handleRemoveProduct(index) {
      let i = this.listProducts.findIndex(
        (ele) => ele.id == this.package_prods[index].product_id
      )
      if (i >= 0) {
        this.product_option.push(this.listProducts[i])
      }
      this.package_prods.splice(index, 1)
      this.product_sku.splice(index, 1)
    },
  },
  watch: {
    visible: function() {
      this.init()
    },
  },
}
</script>
