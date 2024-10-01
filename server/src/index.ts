import { Server } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import prisma from './client'
import config from './config/config'
import logger from './config/logger'

const io = new SocketIOServer({
  cors: {
    origin: '*'
  }
})
let server: Server
prisma.$connect().then(() => {
  logger.info('Connected to SQL Database')
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
  })
  io.attach(server)
})
const activeUsers = new Set<string>()

io.on('connection', (socket) => {
  const id = socket.handshake.query.id as string
  socket.join(id)

  activeUsers.add(id)
  io.to(socket.id).emit('online-users', Array.from(activeUsers))
  socket.broadcast.emit('user-connected', id)

  socket.on(
    'send-message',
    ({
      id,
      authorId,
      recipientId,
      conversationId,
      type,
      message,
      timeSent
    }: {
      id: string
      authorId: string
      recipientId: string
      conversationId: string
      type: string
      message: string
      timeSent: Date
    }) => {
      socket.broadcast.to(recipientId.toString()).emit('receive-message', {
        id,
        authorId,
        type,
        recipientId,
        conversationId,
        message,
        timeSent
      })
    }
  )
  socket.on('typing', ({ recipientId }) => {
    socket.broadcast.to(recipientId.toString()).emit('typing')
  })
  socket.on('disconnect', () => {
    activeUsers.delete(id)
    socket.broadcast.emit('user-disconnected', parseInt(id))
  })
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
