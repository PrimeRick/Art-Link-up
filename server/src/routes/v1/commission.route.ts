import express from 'express'
import validate from '../../middlewares/validate'
import auth from '../../middlewares/auth'
import { commissionValidation } from '../../validations'
import { commissionController } from '../../controllers'
const router = express.Router()

router
  .route('/user')
  .post(
    auth(),
    validate(commissionValidation.createCommissionValidation),
    commissionController.createUserCommission
  )
  .delete(auth(), commissionController.deleteUserCommissions)

router.get('/', auth('getUsers'), commissionController.getAllCommissions)
router.get('/unreported', auth('getUsers'), commissionController.getAllUnrepCommissions)
router.get('/reported', auth('getUsers'), commissionController.getAllReportedCommissions)
router.get('/finished', auth('getUsers'), commissionController.getAllFinishedCommissions)
router.get('/unpaid', auth('getUsers'), commissionController.getAllUnpaidCommissions)
router.post(
  '/mark-paid/:id',
  auth('manageUsers'),
  validate(commissionValidation.paramsValidation),
  commissionController.markCommissionPaid
)
router.post(
  '/mark-finished/:id',
  auth(),
  validate(commissionValidation.paramsValidation),
  commissionController.markCommissionFinished
)

router.get(
  '/user/:id',
  validate(commissionValidation.paramsValidation),
  commissionController.getUserCommissions
)
router.get(
  '/user/finished/:id',
  validate(commissionValidation.paramsValidation),
  commissionController.getUserFinishedCommissions
)
router.get(
  '/user/unfinished/:id',
  validate(commissionValidation.paramsValidation),
  commissionController.getUserUnfinishedCommissions
)
router.get('/artist', auth(), commissionController.getArtistCommissions)

router
  .route('/:id')
  .get(validate(commissionValidation.paramsValidation), commissionController.getCommissionById)
  .patch(
    auth(),
    validate(commissionValidation.updateCommissionValidation),
    commissionController.updateCommissionById
  )
  .delete(
    auth(),
    validate(commissionValidation.paramsValidation),
    commissionController.deleteCommissionById
  )

export default router
