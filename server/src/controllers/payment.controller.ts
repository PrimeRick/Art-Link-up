import catchAsync from '../utils/catch-async'
import { paymentService } from '../services'
import { sendResponse } from '../utils/response'

const createOrder = catchAsync(async (req, res) => {
  const { amount } = req.body
  const resp = await paymentService.createOrder(amount)

  sendResponse(
    res,
    resp.httpStatusCode,
    null,
    { captureOrder: resp.jsonResponse },
    'order created Successfully'
  )
})

const captureOrder = catchAsync(async (req, res) => {
  const { orderID } = req.params
  const resp = await paymentService.captureOrder(orderID)
  // { jsonResponse, httpStatusCode }
  // res.status(resp.httpStatusCode).json(resp.jsonResponse);
  sendResponse(
    res,
    resp.httpStatusCode,
    null,
    { captureOrder: resp.jsonResponse },
    'order captured  Successfully'
  )
})
const artistPayment = catchAsync(async (req, res) => {
  const { amount, email, CommissionId, userId } = req.body
  // console.log('amount ', amount)
  // console.log('email ', email)
  // const user = await (userId)
  // const userDetails = await userService.getUserByuserId(email)
  // const EMAIL = "akhileshjyotishi1729@gmail.com"
  const resp = await paymentService.executePaypalPayout(email, amount, CommissionId, userId)
  // CommissionId: string, userId: string
  sendResponse(
    res,
    resp?.httpStatusCode,
    null,
    { captureOrder: resp?.jsonResponse },
    'payment done Successfully'
  )
})
export default {
  createOrder,
  captureOrder,
  artistPayment
}
