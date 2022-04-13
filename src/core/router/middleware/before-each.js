import Browser from '@core/helpers/browser'
import AuthService from '@core/services/auth'
import S3Service from '@core/services/s3'
import firebase from '../../services/firebase'

// eslint-disable-next-line
const beforeEach = (router, store) => {
  router.beforeEach(async (to, from, next) => {
    // Logout
    if (
      to.fullPath.startsWith('/logout') ||
      (!store.getters['auth/isCutomer'] && AuthService.isAuthenticated())
    ) {
      AuthService.clear()
      S3Service.destroy()
      await firebase.unsubscribe()
      Browser.redirect('/sign-in')
      return
    }

    // Login
    if (to.fullPath.startsWith('/sign-in') && AuthService.isAuthenticated()) {
      Browser.redirect('/')
      return
    }

    // No required auth
    if (to.meta.noAuthRequired) {
      return next()
    }
    if (!AuthService.isAuthenticated() && !to.fullPath.startsWith('/sign-in')) {
      const path = encodeURIComponent(
        window.location.href.replace(window.location.origin, '')
      )

      if (!from.fullPath.startsWith('/404')) {
        return next({ path: `/sign-in?path=${path}` })
      } else if (!from.fullPath.startsWith('/404')) {
        return next({ path: `/sign-in?path=${path}` })
      } else {
        return next({ path: `/sign-in` })
      }
    }

    return next()
  })
}

export default beforeEach
