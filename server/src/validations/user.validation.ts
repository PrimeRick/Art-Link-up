import Joi from 'joi'
import { password } from './custom.validation'

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow('').required()
  })
}

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  }),
  body: Joi.object()
    .keys({
      profileImage: Joi.string().allow('').optional(),
      headline: Joi.string().allow('').optional(),
      location: Joi.string().allow('').optional(),
      languages: Joi.array().items(Joi.string().allow('')).optional(),
      artwork: Joi.array().items(Joi.string().allow('')).optional(),
      instagram: Joi.string().allow('').optional(),
      facebook: Joi.string().allow('').optional(),
      twitter: Joi.string().allow('').optional(),
      youtube: Joi.string().allow('').optional(),
      twitch: Joi.string().allow('').optional(),
      spotify: Joi.string().allow('').optional(),
      soundcloud: Joi.string().allow('').optional(),
      website: Joi.string().allow('').optional(),
      bio: Joi.string().allow('').optional(),
      work: Joi.string().allow('').optional(),
      category: Joi.string().allow('').optional()
    })
    .min(1)
}

const paramsValidation = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
}

export default {
  createUser,
  getUsers,
  updateUser,
  paramsValidation
}
