const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')
const auth = require("../middleware/AuthHandingMiddleware");



router.get('/getOneAd/:id', auth.isAuthorized, adController.getOneAd)
router.get('/getEditAd/:id', auth.isAuthorized, adController.getEditAd)
router.get('/getPremiumDate', auth.isAuthorized, adController.getPremiumDate)
router.get('/search', adController.searchAd)
router.get('/inFavorite', auth.isAuthorized, adController.inFavorite)
router.get('/archive/:id', auth.isAuthorized, adController.adArchive)
router.get('/publish/:id', auth.isAuthorized, adController.adPublish)
router.get('/bookingInfo', auth.isAuthorized, adController.getBookingInfo)

router.delete('/removeFavorite', auth.isAuthorized, adController.removeFavorite)
router.delete('/remove', auth.isAuthorized, adController.removeAd)

router.post('/createAd', auth.isAuthorized, adController.createAd)
router.post('/editAd/:id', auth.isAuthorized, adController.editAd)

module.exports = router
