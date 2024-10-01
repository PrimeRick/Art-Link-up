import nodemailer from 'nodemailer'
import config from '../config/config'
import logger from '../config/logger'
import userService from './user.service'
import ApiError from '../utils/api-error'
import httpStatus from 'http-status'
import commissionSuccessfull from '../templates/commission-successfull'
import postCommission from '../templates/post-commission'

const transport = nodemailer.createTransport(config.email.smtp)
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    )
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = { from: config.email.from, to, subject, html }
  await transport.sendMail(msg)
}

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @param {string} username
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to: string) => {
  const subject = 'Reset password'
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `${config.frontend.url}/reset-password?token=${token}`
  const html = 'your email template here'
  await sendEmail(to, subject, html)
}

/**
 * Send welcome email
 * @param {string} email
 * @returns {Promise}
 */
const sendWelcomeEmail = async (email: string) => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const subject = 'Welcome to app'
  const html = 'your email template'
  await sendEmail(email, subject, html)
}
/**
 * Send commission email
 * @param {string} email
 * @returns {Promise}
 */
const sendCommissionEmail = async (
  email: string,
  chatUrl: string,
  artist_name: string,
  client_name: string,
  amount: number,
  totalDays: number,
  totalRevisions: number
) => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const subject = 'Commission Successfull'
  const html = commissionSuccessfull({
    chatUrl,
    artist_name,
    client_name,
    amount,
    totalDays,
    totalRevisions
  })
  await sendEmail(email, subject, html)
}
/**
 * Send commission email
 * @param {string} email
 * @returns {Promise}
 */
const sendPostCommissionEmail = async (
  email: string,
  commissionUrl: string,
  artist_name: string,
  client_name: string,
  amount: number,
  date_payment: string
) => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const subject = 'Post Commission Successfull'
  const html = postCommission({
    commissionUrl,
    artist_name,
    client_name,
    amount,
    date_payment
  })
  await sendEmail(email, subject, html)
}

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
  sendCommissionEmail,
  sendPostCommissionEmail
}
