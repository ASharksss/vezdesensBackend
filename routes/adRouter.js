const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')
const auth = require("../middleware/AuthHandingMiddleware");



router.get('/getOneAd/:id', auth.isAuthorized, adController.getOneAd)
router.get('/search', adController.searchAd)
router.get('/inFavorite', auth.isAuthorized, adController.inFavorite)
router.get('/archive/:id', auth.isAuthorized, adController.adArchive)
router.get('/publish/:id', auth.isAuthorized, adController.adPublish)

router.delete('/removeFavorite', auth.isAuthorized, adController.removeFavorite)
router.delete('/remove', auth.isAuthorized, adController.removeAd)

router.post('/createAd', auth.isAuthorized, adController.createAd)

module.exports = router
