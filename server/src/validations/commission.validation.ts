import Joi from 'joi'

const idParamsValidation = Joi.object().keys({
  id: Joi.string().required()
})

const paramsValidation = {
  params: idParamsValidation
}

const createCommissionValidation = {
  body: Joi.object().keys({
    backgroundDetails: Joi.string().allow(''),
    artworkDetails: Joi.string().allow(''),
    refPictures: Joi.array().items(Joi.string().allow('')).optional(),
    packageId: Joi.string().required(),
    isFinished: Joi.boolean().optional(),
    isReported: Joi.boolean().optional()
  })
}

const updateCommissionValidation = {
  params: idParamsValidation,
  body: Joi.object()
    .keys({
      backgroundDetails: Joi.string().allow(''),
      artworkDetails: Joi.string().allow(''),
      refPictures: Joi.array().items(Joi.string().allow('')).optional(),
      isFinished: Joi.boolean().optional(),
      isReported: Joi.boolean().optional()
    })
    .min(1)
}

export default {
  paramsValidation,
  createCommissionValidation,
  updateCommissionValidation
}
