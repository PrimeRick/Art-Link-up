import express from 'express'
import auth from '../../middlewares/auth'
// import { packageValidation } from '../../validations'
import { paymentController } from '../../controllers'
const router = express.Router()
// v1/payment
router.route('/orders').post(
  auth(),
  // validate(packageValidation.createPackageValidation),
  paymentController.createOrder
)

// router.get('/', paymentController.getAllPackages)

router.post(
  '/orders/:orderID/capture',
  //   validate(packageValidation.paramsValidation),
  paymentController.captureOrder
)
router.post('/order/batchPayouts', paymentController.artistPayment)
// router
//   .route('/:id')
//   .get(validate(packageValidation.paramsValidation), paymentController.getPackageById)
//   .patch(
//     auth(),
//     validate(packageValidation.updatePackageValidation),
//     paymentController.updatePackageById
//   )
//   .delete(auth(), validate(packageValidation.paramsValidation), paymentController.deletePackageById)

export default router

/**
  
  * Capture payment for the created order to complete the transaction.
  
  * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
  
  */

//   app.post("/api/orders", async (req, res) => {

//     try {

//       // use the cart information passed from the front-end to calculate the order amount detals

//       const { cart } = req.body;

//       const { jsonResponse, httpStatusCode } = await createOrder(cart);

//       res.status(httpStatusCode).json(jsonResponse);

//     } catch (error) {

//       console.error("Failed to create order:", error);

//       res.status(500).json({ error: "Failed to create order." });

//     }

//   });

//   app.post("/api/orders/:orderID/capture", async (req, res) => {

//     try {

//       const { orderID } = req.params;

//       const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

//       res.status(httpStatusCode).json(jsonResponse);

//     } catch (error) {

//       console.error("Failed to create order:", error);

//       res.status(500).json({ error: "Failed to capture order." });

//     }

//   });
