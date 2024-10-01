import express from 'express'
import validate from '../../middlewares/validate'
import auth from '../../middlewares/auth'
import { packageValidation } from '../../validations'
import { packageController } from '../../controllers'
const router = express.Router()

router
  .route('/user')
  .post(
    auth(),
    validate(packageValidation.createPackageValidation),
    packageController.createUserPackage
  )
  .delete(auth(), packageController.deleteUserPackages)

router.get('/', packageController.getAllPackages)

router.get(
  '/user/:id',
  validate(packageValidation.paramsValidation),
  packageController.getUserPackages
)

router
  .route('/:id')
  .get(validate(packageValidation.paramsValidation), packageController.getPackageById)
  .patch(
    auth(),
    validate(packageValidation.updatePackageValidation),
    packageController.updatePackageById
  )
  .delete(auth(), validate(packageValidation.paramsValidation), packageController.deletePackageById)

export default router
