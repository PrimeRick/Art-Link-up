import { Message } from '@prisma/client'
import prisma from '../client'
import ApiError from '../utils/api-error'

type Ret = Omit<Message, 'conversationId' | 'isEdited'>

/**
 * Create a user
 * @param {Object} messageBody
 * @returns {Promise<Ret>}
 */
const createMessage = async (
  message: string,
  authorId: string,
  conversationId: string,
  type: string
): Promise<Ret> => {
  const newMessage = await prisma.message.create({
    data: {
      message,
      authorId,
      conversationId,
      type
    },
    include: {
      conversation: {
        include: {
          participants: true
        }
      }
    }
  })

  // Update dateLastMessage
  const conversation = newMessage.conversation
  if (conversation) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { dateLastMessage: new Date() }
    })
  }

  // Set all participants' isRead to false except author
  conversation?.participants
    .filter((participant) => participant.userId !== authorId)
    .map(async (participant) => {
      await prisma.conversationUser.updateMany({
        where: {
          conversationId: conversationId,
          userId: participant.userId
        },
        data: { isRead: false }
      })
    })

  // Exclude conversationId and isEdited from the response object
  const response: Ret = {
    id: newMessage.id,
    message: newMessage.message,
    authorId: newMessage.authorId,
    created_at: newMessage.created_at,
    type: newMessage.type
  }

  return response
}
const getMessagesInConversation = async (
  conversationId: string,
  currentUserId: string,
  parsedPage: number,
  parsedLimit: number
): Promise<Message[]> => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true }
  })
  if (
    conversation?.participants[0].userId !== currentUserId &&
    conversation?.participants[1].userId !== currentUserId
  ) {
    throw new ApiError(401, 'Unauthorized')
  }
  await prisma.conversationUser.updateMany({
    where: {
      conversationId: conversationId,
      userId: currentUserId
    },
    data: { isRead: true }
  })

  let messages
  if (parsedPage) {
    messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      orderBy: { created_at: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit
    })
  } else {
    messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      orderBy: { created_at: 'desc' }
    })
  }
  return messages
}

const deleteMessage = async (id: string, authorId: string) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id }
    })

    if (message?.authorId !== authorId)
      throw new ApiError(403, 'You can only delete your own messages')

    if (!message) throw new ApiError(403, 'Message not found')

    await prisma.message.delete({
      where: { id }
    })
    return true
  } catch (err) {
    throw new ApiError(500, 'Internal Server Error')
  }
}

const editMessage = async (id: string, userId: string, newMessageBody: string) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id }
    })

    if (!message) throw new ApiError(404, 'Message not found')

    if (message?.authorId !== userId) throw new ApiError(403, 'You can only edit your own messages')

    const updatedMessage = await prisma.message.update({
      where: {
        id
      },
      data: {
        message: newMessageBody,
        isEdited: true
      }
    })
    return updatedMessage
  } catch (err) {
    throw new ApiError(500, 'Internal server Error')
  }
}

export default {
  createMessage,
  getMessagesInConversation,
  deleteMessage,
  editMessage
}
