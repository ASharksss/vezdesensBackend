const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.get('/getOneAd', adController.getOneAd)
router.get('/inFavorite', adController.inFavorite)


router.post('/createAd', adController.createAd)



module.exports = router
