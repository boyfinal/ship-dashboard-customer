<template v-if="uploading">
  <p-modal :active="visible" title="Promotion" @close="handleClose">
    <template>
      <div class="row mb-18 promotion_row">
        <div class="col-12">
          <label class="modal__add-claim-label">Tên: </label>
          <p-input type="text" :input="name" :readonly="true" />
        </div>
      </div>
      <div class="row promotion_row mb-18" v-if="prices.length">
        <div class="col-12">
          <label class="modal__add-claim-label">Chỉnh sửa giá:</label>
          <div class="table-level">
            <table class="table">
              <tr>
                <th>
                  <label>Service (Name)</label>
                </th>
                <th>
                  <label>Cân nặng (gram)</label>
                </th>
                <th>
                  <label>Giá ($)</label>
                </th>
              </tr>
              <tr v-for="(item, index) in prices" :key="index">
                <td>
                  {{ item.service_name }}
                </td>
                <td> &lt; {{ item.weight }} </td>
                <td>
                  {{ item.price }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="row promotion_row" v-if="weights.length">
        <div class="col-12">
          <label class="modal__add-claim-label">Chỉnh sửa cân nặng:</label>
          <div class="table-level">
            <table class="table">
              <tr>
                <th>
                  <label>Mốc cân nặng (gram)</label>
                </th>
                <th>
                  <label>Sai số cho phép (gram)</label>
                </th>
              </tr>
              <tr v-for="(item, index) in weights" :key="index">
                <td>
                  {{ item.weight }}
                </td>
                <td>
                  {{ item.err_weight }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div></div>
      <div class="d-flex">
        <div>
          <p-button @click="handleClose" type="default"> Đóng</p-button>
        </div>
      </div>
    </template>
  </p-modal>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'ModalPromotion',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('shared', {
      promotion: (state) => state.promotion,
    }),
  },
  data() {
    return {
      prices: [],
      weights: [],
      name: '',
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
  watch: {
    visible: {
      handler: function() {
        if (this.promotion) {
          this.name = this.promotion.name
          this.prices = this.promotion.prices
          this.weights = this.promotion.weights
        }
      },
    },
  },
}
</script>
<style>
.promotion_row .form-control,
.promotion_row .multiselect__tags,
.promotion_row .multiselect__single,
.promotion_row .multiselect__input {
  background-color: #f6f7f7 !important;
  border-color: #e1e2e2;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.promotion_row .multiselect__single {
  border: none;
}

.promotion_row textarea.form-control {
  position: relative !important;
  top: 0;
  left: 0;
  height: auto;
  overflow: visible;
}

.table-level {
  max-height: 280px;
  overflow-y: auto;
}

.table-level table {
  border: 1px solid #e1e2e2;
  border-radius: 4px;
  padding: 0 8px;
  margin: unset;
  position: relative;
  border-collapse: unset;
}

.table-level th,
.table-level td {
  padding: 9px 13px;
}

.table-level th {
  z-index: 1;
  background: white;
  position: sticky;
  top: 0;
  border: unset;
}

.table-level td {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #313232;
}

.table-level th label {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.2px;
  color: #898a8a;
}
</style>
