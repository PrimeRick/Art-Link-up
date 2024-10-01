import conversationService from '../services/conversation.service'
import catchAsync from '../utils/catch-async'
import { sendResponse } from '../utils/response'
import httpStatus from 'http-status'

export const newConversation = catchAsync(async (req, res) => {
  const participantIds: string[] = req.body.participants

  if (!participantIds || participantIds.length === 0)
    sendResponse(res, httpStatus.BAD_REQUEST, null, null, 'Must provide array of participants')

  const creatorId: string = res.locals.user.id

  const participants = [creatorId, ...participantIds]
  const response = await conversationService.createNewConversation(participants)
  sendResponse(res, httpStatus.OK, null, { response }, 'sent successfully')
})

export const getAllConversations = catchAsync(async (req, res) => {
  const { userId } = req.params
  // console.log('v1/conversation/userId ', userId)
  const AllConversations = await conversationService.getAllConversations(userId)
  sendResponse(res, httpStatus.OK, null, { AllConversations }, 'sent successfully')
})

export const readConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params
  const userId = res.locals.user.id
  await conversationService.readConversation(conversationId, userId)
  sendResponse(res, 200, null, null, 'sucesss')
})
export default {
  newConversation,
  getAllConversations,
  readConversation
}
