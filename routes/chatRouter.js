const Router = require('express')
const router = new Router()

const chatController = require('../controllers/chatController')

router.get('/getDialogues')
router.get('/getMessages/:id')
router.post('/addDialogues')
router.post('/addMessage')



