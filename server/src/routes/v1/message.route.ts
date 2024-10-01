import express, { Router } from 'express'
import { messageController } from '../../controllers'
import auth from '../../middlewares/auth'
// import { verifyJWT } from "../middleware/verifyJWT";

const messagesRouter: Router = express.Router()

messagesRouter.post('/new', auth(), messageController.newMessage)
messagesRouter.get('/', auth(), messageController.getMessagesInConversation)
messagesRouter
  .route('/:id')
  .delete(auth(), messageController.deleteMessage)
  .put(auth(), messageController.editMessage)

export default messagesRouter
