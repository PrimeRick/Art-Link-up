import express from 'express'
import authRoute from './auth.route'
import messageRoute from './message.route'
import conversationRoute from './conversation.route'
import commissionRoute from './commission.route'
import packageRoute from './package.route'
import userRoute from './user.route'
import uploadRoute from './upload.route'
import paymentRoute from './payment.route'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/messages',
    route: messageRoute
  },
  {
    path: '/conversation',
    route: conversationRoute
  },
  {
    path: '/commission',
    route: commissionRoute
  },
  {
    path: '/upload',
    route: uploadRoute
  },
  {
    path: '/package',
    route: packageRoute
  },
  {
    path: '/payment',
    route: paymentRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router
