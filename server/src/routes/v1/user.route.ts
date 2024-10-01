import express from 'express'
import auth from '../../middlewares/auth'
import validate from '../../middlewares/validate'
import { userValidation } from '../../validations'
import { userController } from '../../controllers'

const router = express.Router()

router.route('/').post(auth(), validate(userValidation.createUser), userController.createUser)

router.get('/clients', userController.getAllClients)
router.get('/artists', userController.getAllArtists)
router.get('/admins', userController.getAllAdmins)
router.post(
  '/artist/create',
  auth('manageUsers'),
  validate(userValidation.createUser),
  userController.createArtist
)
router.delete(
  '/delete/:id',
  auth('manageUsers'),
  validate(userValidation.paramsValidation),
  userController.deleteUserByuserId
)
router.post(
  '/admin/create',
  auth('manageAdmins'),
  validate(userValidation.createUser),
  userController.createAdmin
)
router.delete(
  '/admin/delete/:id',
  auth('manageAdmins'),
  validate(userValidation.paramsValidation),
  userController.deleteUserByuserId
)
router.post(
  '/admin/change/:id',
  auth('manageAdmins'),
  validate(userValidation.paramsValidation),
  userController.changeUserRole
)
router.get(
  '/customDetails/:id',
  validate(userValidation.paramsValidation),
  userController.getCustomDetails
)

router.get('/:id', validate(userValidation.paramsValidation), userController.getUserById)
router
  .route('/:userId')
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), userController.deleteUser)
export default router
