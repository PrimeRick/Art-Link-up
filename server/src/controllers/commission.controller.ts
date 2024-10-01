import conversationService from '../services/conversation.service'
import catchAsync from '../utils/catch-async'
import { sendResponse } from '../utils/response'
import { commissionService, emailService } from '../services'
import httpStatus from 'http-status'
import config from '../config/config'

const getAllCommissions = catchAsync(async (req, res) => {
  const AllCommissions = await commissionService.getAllCommission()
  sendResponse(res, httpStatus.OK, null, { commissions: AllCommissions }, 'sent successfully')
})

const getAllUnrepCommissions = catchAsync(async (req, res) => {
  const AllUnrepCommissions = await commissionService.getAllUnrepCommissions()
  sendResponse(res, httpStatus.OK, null, { commissions: AllUnrepCommissions }, 'sent successfully')
})

const getAllReportedCommissions = catchAsync(async (req, res) => {
  const AllReportedCommissions = await commissionService.getAllReportedCommissions()
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: AllReportedCommissions },
    'sent successfully'
  )
})
const getAllFinishedCommissions = catchAsync(async (req, res) => {
  const AllFinishedCommissions = await commissionService.getAllFinishedCommissions()
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: AllFinishedCommissions },
    'sent successfully'
  )
})

const getAllUnpaidCommissions = catchAsync(async (req, res) => {
  const AllunpaidCommissions = await commissionService.getAllUnpaidCommissions()
  sendResponse(res, httpStatus.OK, null, { commissions: AllunpaidCommissions }, 'sent successfully')
})

const getUserFinishedCommissions = catchAsync(async (req, res) => {
  const userId = req.params.id as string
  const userFinishedCommissions = await commissionService.getUserFinishedCommissions(userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: userFinishedCommissions },
    'sent successfully'
  )
})
const getUserUnfinishedCommissions = catchAsync(async (req, res) => {
  const userId = req.params.id as string
  const userunFinishedCommissions = await commissionService.getUserUnfinishedCommissions(userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: userunFinishedCommissions },
    'sent successfully'
  )
})

const getUserCommissions = catchAsync(async (req, res) => {
  const userId = req.params.id as string
  const userCommissions = await commissionService.getUserCommissions(userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: userCommissions },
    'User Commissions fetched Successfully'
  )
})
const markCommissionPaid = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const userId = res.locals.user.id
  const userCommission = await commissionService.markCommissionPaid(id, userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commission: userCommission },
    'User Commissions marked paid'
  )
})
const markCommissionFinished = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const userId = res.locals.user.id
  const userCommission = await commissionService.markCommissionFinished(id, userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commission: userCommission },
    'User Commissions marked Finished'
  )
})

const createUserCommission = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const commissionBody = req.body
  const userCommission = await commissionService.createUserCommission(userId, commissionBody)
  // console.log(userCommission)
  const conversation = await conversationService.createNewConversation([
    userCommission.client.id,
    userCommission.package.artist.id
  ])
  // console.log(conversation)
  const baseUrl = config.frontend.url
  const name =
    userCommission.package.artist.first_name + ' ' + userCommission.package.artist.last_name
  const chatUrl = `${baseUrl}chat/dev?id=${userCommission.package.artist.id}&title=${name}&conversationId=${conversation.id}&avatar=${userCommission.package.artist.profileImage}`
  await emailService.sendCommissionEmail(
    userCommission?.client?.email,
    chatUrl,
    userCommission?.package?.artist?.username,
    userCommission?.client?.username,
    userCommission?.package?.price,
    userCommission?.package?.totalDays,
    userCommission?.package?.totalRevisions
  )
  // console.log(chatUrl)
  sendResponse(
    res,
    httpStatus.CREATED,
    null,
    { commissions: userCommission, chatUrl },
    'User Commission created Successfully'
  )
})

const deleteUserCommissions = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  await commissionService.deleteUserCommissions(userId)
  sendResponse(res, httpStatus.OK, null, null, 'User Commissions deleted Successfully')
})

const getArtistCommissions = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const commissions = await commissionService.getArtistCommissions(userId)
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions },
    'Artists Commissions fetched Successfully'
  )
})

const getCommissionById = catchAsync(async (req, res) => {
  const id = req.params.id as string
  const commission = await commissionService.getCommissionById(id)
  sendResponse(res, httpStatus.OK, null, { commission }, 'User Commission fetched Successfully')
})

const updateCommissionById = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const id = req.params.id as string
  const updateCommissionBody = req.body
  const userCommission = await commissionService.updateCommissionById(
    userId,
    id,
    updateCommissionBody
  )
  sendResponse(
    res,
    httpStatus.OK,
    null,
    { commissions: userCommission },
    'User Commission updated Successfully'
  )
})

const deleteCommissionById = catchAsync(async (req, res) => {
  const userId = res.locals.user.id
  const id = req.params.id as string
  await commissionService.deleteCommissionById(userId, id)
  sendResponse(res, httpStatus.OK, null, null, 'User Commission deleted Successfully')
})

export default {
  getAllCommissions,
  createUserCommission,
  deleteUserCommissions,
  deleteCommissionById,
  updateCommissionById,
  getCommissionById,
  getUserCommissions,
  getAllUnrepCommissions,
  getAllReportedCommissions,
  getAllFinishedCommissions,
  getUserFinishedCommissions,
  getUserUnfinishedCommissions,
  getAllUnpaidCommissions,
  markCommissionPaid,
  markCommissionFinished,
  getArtistCommissions
}
