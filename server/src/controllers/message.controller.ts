import catchAsync from '../utils/catch-async'
import { messageService } from '../services'
import { sendResponse } from '../utils/response'
import httpStatus from 'http-status'

const newMessage = catchAsync(async (req, res) => {
  const { message, conversationId, type } = req.body

  if (!message || message.trim() === '')
    sendResponse(res, httpStatus.BAD_REQUEST, null, null, 'Must provide a message')

  if (!conversationId)
    sendResponse(res, httpStatus.BAD_REQUEST, null, null, 'Must provide a conversationId')

  const authorId = res.locals.user.id
  // console.log('this is authorId', authorId)
  const newMessage = await messageService.createMessage(message, authorId, conversationId, type)
  sendResponse(res, httpStatus.CREATED, null, { newMessage }, 'Message Created successfully')
})

export const getMessagesInConversation = catchAsync(async (req, res) => {
  // console.log('request is coming till here')
  const { conversationId, page = 1, limit = 10 } = req.query

  if (!conversationId)
    sendResponse(res, httpStatus.BAD_REQUEST, null, null, 'Must provide a conversationId')

  const currentUserId = res.locals.user.id
  const parsedPage = parseInt(page as string)
  const parsedLimit = parseInt(limit as string)
  const messages = await messageService.getMessagesInConversation(
    conversationId as string,
    currentUserId,
    parsedPage,
    parsedLimit
  )
  sendResponse(res, httpStatus.OK, null, { messages }, 'Message fetched successfully')
})

export const deleteMessage = catchAsync(async (req, res) => {
  const id = req.params.id
  const authorId = res.locals.user.id
  await messageService.deleteMessage(id, authorId)
  sendResponse(res, httpStatus.OK, null, null, 'message deleted Successfully')
})

const editMessage = catchAsync(async (req, res) => {
  const { message: newMessageBody } = req.body

  if (!newMessageBody || newMessageBody.trim() === '')
    return res.status(400).json({ message: 'Must provide a message' })

  const id = req.params.id
  const userId = res.locals.user.id
  const editMessage = await messageService.editMessage(id, userId, newMessageBody)
  sendResponse(res, httpStatus.OK, null, { editMessage }, 'Message edited successfully')
})

export default {
  newMessage,
  getMessagesInConversation,
  deleteMessage,
  editMessage
}
