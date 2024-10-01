import Joi from 'joi'
import { password } from './custom.validation'

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow('').required()
  })
}

const registerProvider = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    profileImage: Joi.string(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow('').optional()
  })
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
}

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
}

const addProvider = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    response: Joi.object(),
    providerType: Joi.string().required().valid('GOOGLE', 'FACEBOOK')
  })
}

export default {
  register,
  registerProvider,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  addProvider
}
