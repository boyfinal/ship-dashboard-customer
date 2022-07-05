<template>
  <div class="setting setting-account pages">
    <div class="page-content">
      <div class="page-header">
        <div class="page-header_title header-2"> Thông tin tài khoản </div>
      </div>
      <div class="page-body">
        <div class="account">
          <div class="title">tài khoản</div>
          <div class="form row">
            <div class="col-6 left">
              <label class="font-weight-600 color-newtral-10"
                >Họ và tên: <span class="required">*</span></label
              >
              <p-input
                placeholder="Nhập họ tên"
                type="fullname"
                validate="on"
                v-model="data.full_name"
                :input="data.full_name"
                @input="onQueryChange"
                @status="checkUsername($event)"
                :required="requiredUsername"
              />
            </div>
            <div class="col-6 right">
              <label class="font-weight-600 color-newtral-10">Ngày sinh:</label>
              <div style="display: flex">
                <p-datepicker
                  class="date birthday p-input-group input-group"
                  :format="'dd/mm/yyyy'"
                  :label="label"
                  @update="selectDate"
                  :single-date-picker="true"
                  :showDropdowns="true"
                  :autoApply="true"
                  :maxDate="maxDate"
                  :localeData="localeData"
                >
                </p-datepicker>
                <p-button
                  class="clear ml-2"
                  type="default"
                  icon="close"
                  v-if="this.isSelectDate"
                  @click="clearDate"
              /></div>
            </div>
          </div>
        </div>
        <div class="account">
          <div class="title">Thay đổi mật khẩu</div>
          <div class="form row">
            <div class="col-6 left">
              <label class="font-weight-600 color-newtral-10"
                >Mật khẩu hiện tại: <span class="required">*</span></label
              >
              <p-input
                placeholder="Nhập mật khẩu hiện tại"
                hiddenPass="on"
                type="password"
                validate="on"
                v-model="data.current_password"
                :input="data.current_password"
                @input="onQueryChange"
                :required="requiredCurrentPassword"
                @status="checkPassword($event)"
              />
            </div>
            <div class="col-6 right">
              <label class="font-weight-600 color-newtral-10"
                >Mật khẩu mới: <span class="required">*</span></label
              >
              <p-input
                placeholder="Nhập mật khẩu mới"
                hiddenPass="on"
                type="password"
                validate="on"
                v-model="data.new_password"
                :input="data.new_password"
                @input="onQueryChange"
                :required="requiredNewPassword"
                @status="checkPassword($event)"
              />
            </div>
          </div>
        </div>
        <div class="note">
          <img src="@/assets/img/note.svg" alt="" />
          <p
            ><b>Lưu ý: </b
            ><span class="text"
              >(<span class="required">*</span>) Là các trường bắt buộc
              nhập.</span
            ></p
          >
        </div>
        <div class="save">
          <a
            href="javascript:void(0)"
            class="btn btn-primary"
            style="display: flex;"
            @click="handleSave"
          >
            <span>Lưu</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { date } from '@core/utils/datetime'
import { mapState, mapActions } from 'vuex'
import { UPDATE_USER } from '@/packages/setting/store/index'
import { GET_USER } from '../../../packages/shared/store'
export default {
  name: 'Account',
  computed: {
    ...mapState('shared', {
      user: (state) => state.user,
    }),

    maxDate() {
      return new Date()
    },
  },
  mounted() {
    this.data.full_name = this.user.full_name
    this.data.birthday = this.user.birthday
    this.label = this.data.birthday ? this.data.birthday : 'dd/mm/yyyy'
  },
  data() {
    return {
      data: {
        full_name: '',
        current_password: '',
        new_password: '',
        birthday: '',
      },
      isLoading: false,
      label: 'dd/mm/yyyy',
      requiredCurrentPassword: false,
      requiredNewPassword: false,
      requiredUsername: false,
      isSelectDate: false,
      localeData: {
        firstDay: 1,
        format: 'dd/MM/yyyy',
        monthNames: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
        daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      },
    }
  },

  methods: {
    ...mapActions('setting', [UPDATE_USER]),
    ...mapActions('shared', [GET_USER]),

    checkRequired() {
      let result = true
      if (this.data.full_name == '') {
        this.requiredUsername = true
        result = false
      } else {
        this.requiredUsername = false
      }

      if (this.data.current_password == '' && this.data.new_password != '') {
        this.requiredCurrentPassword = true
        result = false
      } else {
        this.requiredCurrentPassword = false
      }

      if (this.data.new_password == '' && this.data.current_password != '') {
        this.requiredNewPassword = true
        result = false
      } else {
        this.requiredNewPassword = false
      }

      return result
    },

    checkUsername(e) {
      if (e) {
        return (this.correctUsername = true)
      }
      return (this.correctUsername = false)
    },

    checkPassword(e) {
      if (e) {
        return (this.correctPassword = true)
      }
      return (this.correctPassword = false)
    },

    async handleSave() {
      if (!this.checkRequired()) {
        return
      }

      if (this.correctUsername == false || this.correctPassword == false) {
        return
      }

      this.data.full_name = this.data.full_name.trim()
      const result = await this.updateUser(this.data)

      if (result.error) {
        this.$toast.open({
          type: 'error',
          message: result.message,
          duration: 3000,
        })
        return
      }

      location.reload()
      this.$toast.open({
        type: 'success',
        message: 'Cập nhật thành công!',
        duration: 3000,
      })
    },

    selectDate(v) {
      this.data.birthday = date(v.startDate, 'dd/MM/yyyy')
      if (this.data.birthday == '') {
        return (this.label = 'dd/mm/yyyy')
      }
      this.label = this.data.birthday
      this.isSelectDate = true
    },

    onQueryChange() {
      this.checkRequired()
    },

    clearDate() {
      this.data.birthday = ''
      this.label = 'dd/mm/yyyy'
      this.isSelectDate = false
    },
  },
  watch: {
    user: {
      handler: function(newVal) {
        this.data.full_name = newVal.full_name
        this.data.birthday = newVal.birthday
        this.label = this.data.birthday ? this.data.birthday : 'dd/mm/yyyy'
      },
      deep: true,
    },
  },
}
</script>
