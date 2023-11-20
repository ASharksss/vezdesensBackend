const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.get('/getOneAd/:id', adController.getOneAd)
router.get('/inFavorite', adController.inFavorite)
router.delete('/removeFavorite', adController.removeFavorite)


router.post('/createAd', adController.createAd)



module.exports = router
