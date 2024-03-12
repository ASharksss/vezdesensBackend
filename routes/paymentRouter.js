const Router = require('express')
const router = new Router()
const paymentController = require('../controllers/paymentController')
const auth = require("../middleware/AuthHandingMiddleware");

router.get('/ads', auth.isAuthorized, paymentController.payAd)
router.get('/success', paymentController.success)
router.get('/error', paymentController.error)

module.exports = router
