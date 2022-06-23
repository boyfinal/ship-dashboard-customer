<template>
  <div class="create__package pages">
    <div class="container">
      <div class="page-header">
        <div class="page-header_title header-2">Thông tin đơn hàng </div>
        <div class="create__package-warning">
          (<span>*</span>) Là các trường bắt buộc nhập.
        </div>
      </div>
      <div class="page-content">
        <div class="card">
          <div class="card-body">
            <div class="row sm-gutters  flex-nowrap">
              <div class="col-lg-6 col-xl-6 item-gutters ">
                <div class="card__w">
                  <div class="card__w-header">
                    Người nhận
                  </div>
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
                          v-validate="'required|fullName'"
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
                      <label class="card__w-label">
                        Điện thoại:
                      </label>
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
                      <label class="card__w-label">
                        Địa chỉ phụ:
                      </label>
                      <div class="card__w-input">
                        <input
                          placeholder="Nhập địa chỉ phụ"
                          type="text"
                          v-model="address2"
                          :input="address2"
                          class="form-control"
                          v-validate="'address'"
                          name="address"
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
                        <span
                          class="err-span"
                          v-if="errors.has('countrycode')"
                          >{{ errors.first('countrycode') }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card__w">
                  <div
                    class="card__w-header d-flex justify-content-between align-items-center pr-16 pl-16"
                  >
                    Sản phẩm
                    <div class="add-product">
                      <a @click="handleAddProduct" class="btn btn-add">
                        <img src="~@assets/img/Add 20px.png" />
                      </a>
                    </div>
                  </div>
                  <div class="card__w-content pr-16 pl-16">
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
                                @remove="handleRemove(index)"
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
                          <div class="add-product">
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
                  <div class="card__w-header">
                    Chi tiết đơn hàng
                  </div>
                  <div class="card__w-content">
                    <div class="card__w-item" v-if="false">
                      <label class="card__w-label">
                        Danh sách sản phẩm:
                      </label>
                      <div class="card__w-input">
                        <multiselect
                          class="multiselect-custom dropdown-reason"
                          v-model="order"
                          :options="products"
                          placeholder="Chọn một "
                          @select="handleSelect"
                          :custom-label="customLabel"
                        ></multiselect>
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label">
                        Mã đơn hàng: <span>*</span>
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
                        Chi tiết sản phẩm: <span>*</span>
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
                          :class="{ 'error-color': errors.has('length') }"
                        />
                        <span class="err-span" v-if="errors.has('length')">{{
                          errors.first('length')
                        }}</span>
                        <div class="card__w-unit">cm</div>
                      </div>
                    </div>
                    <div class="card__w-item">
                      <label class="card__w-label">
                        Rộng: <span>*</span>
                      </label>
                      <div class="card__w-input">
                        <input
                          placeholder="Nhập chiều rộng "
                          type="text"
                          v-model="width"
                          :input="width"
                          class="form-control"
                          v-validate="'required|width'"
                          name="width"
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
                          data-vv-as="Chiều cao"
                          :class="{ 'error-color': errors.has('height') }"
                        />
                        <span class="err-span" v-if="errors.has('height')">{{
                          errors.first('height')
                        }}</span>
                        <div class="card__w-unit">cm</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card__w">
                  <div class="card__w-header">
                    Dịch vụ gửi
                  </div>
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
        </div>
      </div>
      <div class="page-footer">
        <div class="container">
          <div class="page-footer__left" style="float: left">
            <div class="total">
              <div class="total-title">Cước tạm tính:</div>
              <span class="total-number">{{ 0 | formatPrice }}</span>
            </div>
          </div>
          <div class="page-footer__right" style="float: right">
            <a
              :class="{ 'is-disabled': isCreate }"
              @click="handleCreate"
              class="btn btn-primary"
              >Tạo mới</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.total-number {
  padding: 21px 16px;
  flex: 1;
  align-items: center;
  color: #111212;
  font-weight: 600;
}
</style>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  FETCH_LIST_PRODUCTS,
  FETCH_LIST_SERVICE,
  GET_SERVICE,
  CREATE_PACKAGE,
} from '../store'
import { LIST_PRODUCT } from '../../setting/store'
import { cloneDeep } from '@core/utils'
export default {
  name: 'CreatePackage',
  data() {
    return {
      isCreate: false,
      order: null,
      fullname: '',
      phone: '',
      city: '',
      address: '',
      address2: '',
      state: '',
      postcode: '',
      accept: false,
      countrycode: '',
      detail: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      order_number: '',
      service: {
        id: 0,
        name: 'Chọn một dịch vụ',
      },
      package_prods: [
        {
          product_id: 0,
          sku: 'Chọn SKU',
          quantity: '',
          name: 'Tên sản phẩm',
          err: '',
        },
      ],
      product_sku: [
        {
          product_id: 0,
          sku: 'Chọn SKU',
          quantity: '',
          name: 'Tên sản phẩm',
        },
      ],
      product_option: [],
    }
  },
  computed: {
    ...mapState('package', {
      products: (state) => state.products,
    }),
    ...mapState('setting', {
      listProducts: (state) => state.products,
    }),
    ...mapGetters('package', {
      services: GET_SERVICE,
    }),
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('package', [
      FETCH_LIST_PRODUCTS,
      FETCH_LIST_SERVICE,
      CREATE_PACKAGE,
    ]),
    ...mapActions('setting', [LIST_PRODUCT]),
    async init() {
      await this[FETCH_LIST_SERVICE]()
      await this[FETCH_LIST_PRODUCTS]()
      this.fullname = ''
      this.phone = ''
      this.city = ''
      this.state = ''
      this.postcode = ''
      this.address = ''
      this.address2 = ''
      this.note = ''
      this.code = ''
      this.items = ''
      this.weight = ''
      this.length = ''
      this.width = ''
      this.height = ''
      this.countrycode = ''
      this.service = ''
      this.service = {
        id: 0,
        name: 'Chọn một dịch vụ',
      }
      let result = await this.listProduct()
      if (!result.success) {
        this.$toast.open({ type: 'danger', message: result.message })
        return
      }

      this.product_option = cloneDeep(this.listProducts)
    },
    customLabelProd(item) {
      return item.sku
    },

    customLabel(item) {
      return item.name
    },
    handleSelect(value) {
      this.sender = value
    },
    handleSelectService(value) {
      this.service = value
    },

    async handleCreate() {
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

      if (!this.service || !this.service.id) {
        this.isCreate = false
        this.$toast.open({
          type: 'error',
          message: 'Bạn chưa chọn dịch vụ gửi',
          duration: 3000,
        })
        return
      }

      this.isCreate = true
      const params = {
        recipient: this.fullname.trim(),
        phone_number: this.phone.trim(),
        address_1: this.address.trim(),
        city: this.city.trim(),
        state_code: this.state.trim(),
        zipcode: this.postcode.trim(),
        country_code: this.countrycode.trim(),
        sku: this.order_number.trim(),
        detail: this.detail.trim(),
        weight: +this.weight.trim(),
        width: +this.width.trim(),
        length: +this.length.trim(),
        height: +this.height.trim(),
        service: this.service.name.trim(),
        address_2: this.address2.trim(),
        package_products: package_products,
      }
      let result = await this[CREATE_PACKAGE](params)
      if (!result.id || result.error) {
        this.isCreate = false
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }
      this.$toast.open({
        type: 'success',
        message: `Tạo đơn thành công`,
        duration: 3000,
      })
      this.isCreate = false
      this.$router.push({
        name: 'package-detail',
        params: { id: result.id },
      })
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

    handleRemove(index) {
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
  },
}
</script>
