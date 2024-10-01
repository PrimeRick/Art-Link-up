import ApiError from '../utils/api-error'
import commissionService from './commission.service'

// type PackageRet = Omit<Package, 'createdAt' | 'updatedAt' | 'artistId' | 'Commission'>
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env
const base = 'https://api-m.sandbox.paypal.com'

/**

* Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.

* @see https://developer.paypal.com/api/rest/authentication/

*/

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS')
    }

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64')

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',

      body: 'grant_type=client_credentials',

      headers: {
        Authorization: `Basic ${auth}`
      }
    })

    const data = await response.json()

    return data.access_token
  } catch (error) {
    console.error('Failed to generate Access Token:', error)
  }
}

async function handleResponse(response: any) {
  try {
    const jsonResponse = await response.json()

    return {
      jsonResponse,

      httpStatusCode: response.status
    }
  } catch (err) {
    // const errorMessage = await respons;
    // console.log('error here', err)
    // throw new Error(err);
  }
}

const createOrder = async (amount: any): Promise<any> => {
  // use the cart information passed from the front-end to calculate the purchase unit details]
  try {
    const accessToken = await generateAccessToken()

    const url = `${base}/v2/checkout/orders`

    const payload = {
      intent: 'CAPTURE',

      purchase_units: [
        {
          amount: {
            currency_code: 'USD',

            value: amount
          }
        }
      ]
    }
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${accessToken}`

        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:

        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/

        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'

        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'

        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },

      method: 'POST',

      body: JSON.stringify(payload)
    })
    return handleResponse(response)
  } catch (err: any) {
    throw new ApiError(400, 'something went wrong')
  }
}
const captureOrder = async (orderID: any): Promise<any> => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  try {
    const accessToken = await generateAccessToken()

    const url = `${base}/v2/checkout/orders/${orderID}/capture`

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${accessToken}`

        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:

        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/

        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'

        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'

        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      }
    })

    return handleResponse(response)
  } catch (err: any) {
    throw new ApiError(400, 'something went wrong')
  }
}
const executePaypalPayout = async (
  email: string,
  amount: string,
  CommissionId: string,
  userId: string
) => {
  try {
    // console.log(email, amount)
    const accessToken = await generateAccessToken()

    const url = 'https://api-m.sandbox.paypal.com/v1/payments/payouts'

    const payload = {
      sender_batch_header: {
        sender_batch_id: `Payouts_${Date.now()}`,
        email_subject: 'You have a payout!',
        email_message: 'You have received a payout! Thanks for using our service!'
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amount,
            currency: 'USD'
          },
          note: 'Thanks for your patronage!',
          receiver: `${email}`,
          notification_language: 'en-US'
        }
      ]
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // "PayPal-Request-Id": "54227a1c-b057-4586-8ea7-f95f64a377c4",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    })
    const d = await response.json()
    // console.log(d)
    await commissionService.markCommissionPaid(CommissionId, userId)

    // return handleResponse(response);
    return d
  } catch (error) {
    console.error('Failed to execute PayPal Payout:', error)
    throw new ApiError(400, 'something went wrong')
  }
}

export default {
  createOrder,
  captureOrder,
  executePaypalPayout
}
