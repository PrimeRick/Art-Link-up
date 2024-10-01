import Joi from 'joi'

const idParamsValidation = Joi.object().keys({
  id: Joi.string().required()
})

const paramsValidation = {
  params: idParamsValidation
}

const createPackageValidation = {
  body: Joi.object().keys({
    name: Joi.string().valid('PREMIUM', 'STANDARD', 'BASIC_PLAN'),
    actualname: Joi.string().required(),
    description: Joi.string().allow('').required(),
    price: Joi.number().required(),
    totalDays: Joi.number().integer().required(),
    totalRevisions: Joi.number().integer().required()
  })
}

const updatePackageValidation = {
  params: idParamsValidation,
  body: Joi.object()
    .keys({
      actualname: Joi.string().required(),
      description: Joi.string().allow(''),
      price: Joi.number(),
      totalDays: Joi.number().integer(),
      totalRevisions: Joi.number().integer()
    })
    .min(1)
}

export default {
  paramsValidation,
  createPackageValidation,
  updatePackageValidation
}
