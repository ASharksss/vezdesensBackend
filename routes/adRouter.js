const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.get('/getOneAd/:id', adController.getOneAd)
router.get('/inFavorite', adController.inFavorite)
router.get('/archive/:id', adController.adArchive)
router.get('/publish/:id', adController.adPublish)

router.delete('/removeFavorite', adController.removeFavorite)

router.post('/createAd', adController.createAd)

module.exports = router
