<template>
  <div>
    <img id="bg-fb" src="~@/assets/img/feedback.png" />
    <p-modal
      v-if="isRated"
      class="thank_rate"
      :active="visible_1"
      @close="handleClose1"
    >
      <img src="~@/assets/img/thank_for_rate.png" />
    </p-modal>
    <div v-else class="feedback-modal">
      <p-modal
        :active="visible"
        @close="handleClose"
        :title="`Phản hồi khách hàng`"
      >
        <template>
          <div class="row mb-8">
            <div class="col-5">
              <label>Tiêu đề: </label>
            </div>
            <div class="col-7">
              {{ ticket.title }}
            </div>
          </div>
          <div class="row mb-8">
            <div class="col-5">
              <label>Nội dung: </label>
            </div>
            <div class="col-7">
              {{ ticket.content }}
            </div>
          </div>
          <div class="star mb-20">
            <AwesomeVueStarRating
              :star="this.star"
              :disabled="this.disabled"
              :maxstars="this.maxstars"
              :starsize="this.starsize"
              :hasresults="this.hasresults"
              :hasdescription="this.hasdescription"
            />
          </div>
          <div style="margin-bottom: -16px;">
            <textarea
              style="position: static"
              rows="4"
              cols="50"
              class="form-control"
              placeholder="Phản hồi thêm (không bắt buộc)"
              v-model="response"
              name="message"
            ></textarea>
          </div>
        </template>
        <template slot="footer">
          <p-button
            :loading="isSubmitting"
            type="primary"
            @click="handleSave"
            style="margin: auto;width: 448px"
          >
            Gửi phản hồi
          </p-button>
        </template>
      </p-modal>
    </div>
  </div>
</template>

<script>
import AwesomeVueStarRating from 'awesome-vue-star-rating'
import { FETCH_RATING_TICKET, RATING_TICKET } from '@/packages/claim/store'
import { mapActions, mapState } from 'vuex'
import Browser from '@core/helpers/browser'
export default {
  name: 'FeedBack',
  components: {
    AwesomeVueStarRating,
  },
  data() {
    return {
      response: '',
      star: 5,
      hasresults: false,
      hasdescription: false,
      starsize: '3x',
      maxstars: 5,
      disabled: false,
      visible: true,
      visible_1: true,
      isSubmitting: false,
      isRated: false,
    }
  },
  computed: {
    ...mapState('claim', {
      ticket: (state) => state.ratingTicket,
    }),
    ticketID() {
      return parseInt(this.$route.params.id)
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('claim', [FETCH_RATING_TICKET, RATING_TICKET]),
    async init() {
      const r = await this[FETCH_RATING_TICKET](this.ticketID)

      if (r.error && r.statusCode == 403) {
        Browser.redirect('/logout')
        return
      }

      if (this.ticket.is_rated) {
        this.isRated = true
        await this.delay(2000)
        this.$router.push({ name: 'claims' })
      }
    },
    async handleSave() {
      const star = document.querySelectorAll('.star.active').length
      let payload = {
        ticket_id: this.ticket.id,
        rating: star,
        response: this.response,
      }
      this.isSubmitting = true
      const r = await this[RATING_TICKET](payload)
      this.isSubmitting = false
      if (r.error) {
        this.$toast.open({ type: 'error', message: r.message })
        return
      }
      this.isRated = true
      await this.delay(2000)
      this.$router.push({ name: 'claims' })
    },
    async delay(ms) {
      return new Promise((res) => setTimeout(res, ms))
    },
    handleClose() {
      this.visible = false
    },
    handleClose1() {
      this.visible_1 = false
    },
  },
}
</script>
<style>
.rating .list {
  text-align: center;
}
.feedback-modal .p-modal-content {
  width: 480px;
}
#bg-fb {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
}
.feedback-modal .modal-footer {
  border: none;
}
.feedback-modal .row {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #313232;
}
.feedback-modal .row label {
  color: #626363;
}
.thank_rate .modal-footer {
  display: none;
}
.thank_rate .modal-header {
  border: none;
  position: absolute;
  right: 0;
}
.thank_rate .modal-header .close {
  z-index: 9999;
}
.thank_rate .modal-body {
  padding: 0;
}
.thank_rate .p-modal-content {
  width: 480px;
  height: 228px;
}
</style>
