const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')


router.get('/auth', userController.check)
router.get('/getOneUser/:id', userController.getOneUser)
router.get('/getArchiveAds/:id', userController.getArchiveAds)

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/review', userController.review)


router.get('/:id')
module.exports = router
