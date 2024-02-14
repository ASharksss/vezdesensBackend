const Router = require('express')
const auth = require("../middleware/AuthHandingMiddleware");
const supportController = require("../controllers/supportController")
const router = new Router()


router.post('/createTopicAppeals', supportController.createTopicAppeals)
router.post('/createStatusAppeals', supportController.createStatusAppeals)
router.post('/createAppeal', supportController.createAppeal)
router.post('/createMessage', supportController.createMessage)
router.post('/createResponseSupport', supportController.createResponseSupport)

router.get('/getAllAppeal', supportController.getAllAppeal)
router.get('/getTopicAppeals', supportController.getTopicAppeals)

module.exports = router