import httpStatus from 'http-status'
import catchAsync from '../utils/catch-async'
import { authService, userService, tokenService } from '../services'
import exclude from '../utils/exclude'
import { sendResponse } from '../utils/response'
import { RoleType } from '@prisma/client'

const getUser = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const user = await userService.getUser(userId)
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt'])
  sendResponse(res, httpStatus.OK, null, { user: userWithoutPassword }, 'User fetched successfully')
})

const register = catchAsync(async (req, res) => {
  const { email, password, username, first_name, last_name } = req.body
  const user = await userService.createUser(
    email,
    password,
    username,
    first_name,
    RoleType.CLIENT,
    last_name
  )
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt'])
  sendResponse(
    res,
    httpStatus.CREATED,
    null,
    { user: userWithoutPassword },
    'User created successfully'
  )
})

const registerProvider = catchAsync(async (req, res) => {
  const { email, username, profileImage, first_name, last_name } = req.body
  const existingUser = await userService.getUserByEmail(email)
  if (existingUser) {
    const tokens = await tokenService.generateAuthTokens(existingUser)
    const userWithoutPassword = exclude(existingUser, ['password', 'createdAt', 'updatedAt'])
    sendResponse(
      res,
      httpStatus.OK,
      null,
      { user: userWithoutPassword, token: tokens },
      'User logged in successfully'
    )
  } else {
    const user = await userService.createProviderUser(
      email,
      username,
      first_name,
      last_name,
      profileImage
    )
    const tokens = await tokenService.generateAuthTokens(user)
    const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt'])
    sendResponse(
      res,
      httpStatus.CREATED,
      null,
      { user: userWithoutPassword, token: tokens },
      'User registered successfully'
    )
  }
})

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  sendResponse(res, httpStatus.OK, null, { user, tokens }, 'User logged in successfully')
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken)
  sendResponse(res, httpStatus.OK, null, null, 'User logged out successfully')
})

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken)
  sendResponse(res, httpStatus.OK, null, { ...tokens }, 'Success')
})

// const forgotPassword = catchAsync(async (req, res) => {
//   const { resetPasswordToken, username } = await tokenService.generateResetPasswordToken(
//     req.body.email
//   )
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, username)
//   sendResponse(res, httpStatus.OK, null, null, 'Mail sent successfully')
// })

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token as string, req.body.password)
//   sendResponse(res, httpStatus.OK, null, null, 'Password reset successfull')
// })

const addProvider = catchAsync(async (req, res) => {
  const { response, providerType, userId } = req.body
  await authService.addProvider(userId, response, providerType)
  sendResponse(res, httpStatus.CREATED, null, null, 'success')
})

export default {
  getUser,
  register,
  registerProvider,
  login,
  logout,
  refreshTokens,
  // forgotPassword,
  // resetPassword,
  addProvider
}
