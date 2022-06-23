<template>
  <div class="modal__edit-order">
    <p-modal
      :active="visible"
      @close="handleClose"
      :title="`Reship đơn ${current.order_number} (${current.code_package})`"
    >
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
                <div class="card__w-header">Người nhận</div>
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
                    <label class="card__w-label">Điện thoại:</label>
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
                </div>

                <div class="card__w-content pr-13 pl-13">
                  <div class="card__w-item">
                    <div class="card__w-input ml-0">
                      <div
                        class="d-flex product-item"
                        v-for="(prod, index) in products"
                        :key="index"
                      >
                        <div class="row product-info">
                          <div class="select-product col-md-7 ">
                            <select
                              disabled="disabled"
                              class="form-control"
                              style="padding: 10px 16px;"
                            >
                              <option value="">{{ prod.sku }}</option>
                            </select>
                          </div>
                          <div class="select-product col-md-5">
                            <div class="product-name">
                              {{ prod.name }}
                            </div>
                          </div>
                        </div>
                        <input
                          placeholder="Số lượng"
                          :value="prod.quantity"
                          class="form-control select-product product-quantity"
                          name="quantity"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-6 item-gutters">
              <div class="card__w">
                <div class="card__w-header"> Chi tiết đơn hàng</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">Mã đơn hàng:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="current.order_number"
                        class="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Chi tiết sản phẩm:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="current.detail"
                        class="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Trọng lượng:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="weight"
                        class="form-control"
                        data-vv-as="Trọng lượng"
                        disabled
                      />
                      <div class="card__w-unit">gram</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Dài:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="length"
                        class="form-control"
                        disabled
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Rộng:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="width"
                        class="form-control"
                        disabled
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                  <div class="card__w-item">
                    <label class="card__w-label">Cao:</label>
                    <div class="card__w-input">
                      <input
                        type="text"
                        :value="height"
                        class="form-control"
                        disabled
                      />
                      <div class="card__w-unit">cm</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card__w">
                <div class="card__w-header">Dịch vụ gửi</div>
                <div class="card__w-content">
                  <div class="card__w-item">
                    <label class="card__w-label">Dịch vụ gửi:</label>
                    <div class="card__w-input">
                      <span>{{ current.service_name }}</span>
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
              class="btn btn-primary mr-2"
              :disabled="isUpdating"
              @click="estimateCostHandle"
            >
              <span v-if="feeReship"
                >Phí reship: {{ feeReship | formatPrice }}</span
              >
              <span v-else>Phí reship</span>
            </p-button>
            <p-button
              class="btn btn-primary"
              :disabled="isUpdating"
              @click="submitHandle"
              >Reship</p-button
            >
          </div>
        </div>
      </template>
    </p-modal>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  PACKAGE_RESHIP,
  FETCH_PACKAGE_PRODUCTS,
  PACKAGE_RESHIP_ESTIMATE_COST,
} from '../../store'

export default {
  name: 'ModalReship',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fullname: '',
      phone: '',
      city: '',
      state: '',
      postcode: '',
      countrycode: '',
      address: '',
      address2: '',
      isUpdating: false,

      weight: 0,
      width: 0,
      length: 0,
      height: 0,

      feeReship: 0,
    }
  },
  computed: {
    ...mapState('package', {
      products: (state) => state.package_products,
    }),
  },

  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('package', [
      PACKAGE_RESHIP,
      FETCH_PACKAGE_PRODUCTS,
      PACKAGE_RESHIP_ESTIMATE_COST,
    ]),

    async init() {
      const current = this.current || {}
      if (!current.id || current.id < 1) {
        return
      }

      this.feeReship = 0

      this.fullname = current.recipient
      this.phone = current.phone_number
      this.city = current.city
      this.state = current.state_code
      this.postcode = current.zipcode
      this.countrycode = current.country_code
      this.address = current.address_1
      this.address2 = current.address_2

      this.weight = current.actual_weight
      this.width = current.actual_width
      this.length = current.actual_length
      this.height = current.actual_height

      if (this.weight == 0) {
        this.weight = current.weight
      }

      if (
        this.width * this.length * this.height <
        current.width * current.length * current.height
      ) {
        this.width = current.width
        this.length = current.length
        this.height = current.height
      }

      await this[FETCH_PACKAGE_PRODUCTS](current.id)
    },

    reset() {
      this.fullname = ''
      this.phone = ''
      this.city = ''
      this.state = ''
      this.postcode = ''
      this.countrycode = ''
      this.address = ''
      this.address2 = ''
    },

    handleClose() {
      this.reset()
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

    async estimateCostHandle() {
      if (this.isUpdating || !this.current.id) return

      this.isUpdating = true
      this.feeReship = 0

      const params = {
        id: this.current.id,
        recipient: this.fullname.trim(),
        phone_number: this.phone.trim(),
        address_1: this.address.trim(),
        city: this.city.trim(),
        state_code: this.state.trim(),
        zipcode: this.postcode.trim(),
        country_code: this.countrycode.trim(),
        address_2: this.address2.trim(),
      }

      const result = await this[PACKAGE_RESHIP_ESTIMATE_COST](params)

      this.isUpdating = false

      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.feeReship = result.total_amount
    },

    async submitHandle() {
      if (this.isUpdating || !this.current.id) return

      const validate = await this.$validator.validateAll()
      if (!validate) return

      this.isUpdating = true

      const params = {
        id: this.current.id,
        recipient: this.fullname.trim(),
        phone_number: this.phone.trim(),
        address_1: this.address.trim(),
        city: this.city.trim(),
        state_code: this.state.trim(),
        zipcode: this.postcode.trim(),
        country_code: this.countrycode.trim(),
        address_2: this.address2.trim(),
      }

      const result = await this[PACKAGE_RESHIP](params)

      this.isUpdating = false

      if (result.error) {
        this.$toast.error(result.message, { duration: 3000 })
        return
      }

      this.$toast.success('Tạo yêu cầu reship đơn thành công', {
        duration: 3000,
      })
      this.handleClose()
      this.$emit('success', true)
    },
  },
  watch: {
    visible: function() {
      this.init()
    },
  },
}
</script>
