const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/AuthHandingMiddleware')


router.get('/auth', userController.check)
router.get('/getOneUser/:id', userController.getOneUser)
router.get('/getArchiveAds/:id', userController.getArchiveAds)
router.get('/getFavorite', auth.isAuthorized, userController.getFavorite)
router.get('/review/:id', userController.getUserReview)

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/review', auth.isAuthorized, userController.review)
router.post('/edit', auth.isAuthorized, userController.editInfo)


router.get('/:id')
module.exports = router
