const Router = require('express')
const router = new Router()


const chatController = require('../controllers/chatController')

router.get('/getDialogues')
router.get('/getMessages', chatController.getMessages)
router.get('/check', chatController.getCheckNewMessages)
router.post('/addDialogues', chatController.addDialogues)
router.post('/addMessage', chatController.addMessage)

module.exports = router


