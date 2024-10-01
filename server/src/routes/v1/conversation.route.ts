import express, { Router } from 'express'
import { conversationController } from '../../controllers'
import auth from '../../middlewares/auth'

const conversationsRouter: Router = express.Router()

conversationsRouter.post('/new', auth(), conversationController.newConversation)

conversationsRouter.get('/:userId', auth(), conversationController.getAllConversations)

conversationsRouter.put('/:conversationId/read', auth(), conversationController.readConversation)

export default conversationsRouter
