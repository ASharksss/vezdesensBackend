const Router = require('express')
const router = new Router()


const chatController = require('../controllers/chatController')

router.get('/getDialogues')
router.get('/getMessages/:id')
router.get('/getMessages/', chatController.getMessages)
router.post('/addDialogues')
router.post('/addMessage', chatController.addMessage)

module.exports = router


