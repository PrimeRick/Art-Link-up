import prisma from '../client'
import ApiError from '../utils/api-error'
import messageService from './message.service'

const createNewConversation = async (participants: string[]): Promise<any> => {
  try {
    const query = {
      AND: participants.map((participantId) => ({
        participants: {
          some: {
            userId: participantId
          }
        }
      }))
    }

    const existingConversation = await prisma.conversation.findMany({
      where: query,
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true
              }
            }
          }
        }
      }
    })
    if (existingConversation.length > 0) {
      const response = {
        ...existingConversation[0],
        messages: undefined,
        participants: existingConversation[0].participants.map((participant) => participant.user)
      }
      return response
    }
    const data = participants.map((participantId) => ({
      user: { connect: { id: participantId } }
    }))

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: data
        }
      },
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true
              }
            }
          }
        }
      }
    })
    const response = {
      ...conversation,
      messages: undefined,
      participants: conversation.participants.map((participant) => participant.user)
    }
    const date = new Date().toLocaleDateString() //
    await messageService.createMessage(
      `Started ON ${date}`,
      conversation.participants[0].user.id,
      conversation.id,
      'system'
    )
    return response
  } catch (err) {
    throw new ApiError(500, 'Internal Server Error')
  }
}
const getAllConversations = async (userId: string): Promise<any> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        },
        messages: {
          some: {}
        }
      },
      select: {
        id: true,
        title: true,
        messages: {
          select: {
            id: true,
            message: true,
            created_at: true
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 1
        },
        participants: {
          select: {
            isRead: true,
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true
              }
            }
          }
        }
      },
      orderBy: {
        dateLastMessage: 'desc'
      }
    })
    // console.log('particular conversation', conversations)
    const response = conversations.map((conversation) => {
      const isRead =
        conversation.participants[0].user.id === userId
          ? conversation.participants[0].isRead
          : conversation.participants[1].isRead
      return {
        ...conversation,
        lastMessageSent: conversation.messages[0],
        messages: undefined,
        participants: conversation.participants.map((participant) => participant.user),
        isRead
      }
    })
    return response
  } catch (err) {
    throw new ApiError(500, 'Internal Server Error')
  }
}
const readConversation = async (conversationId: string, userId: string) => {
  try {
    await prisma.conversationUser.updateMany({
      where: {
        conversationId,
        userId
      },
      data: {
        isRead: true
      }
    })
    return true
  } catch (err) {
    console.error(err)
    throw new ApiError(500, 'Internal Server Error')
  }
}

export default {
  createNewConversation,
  getAllConversations,
  readConversation
}
