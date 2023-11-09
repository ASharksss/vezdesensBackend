const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')


router.get('/auth', userController.check)
router.get('/getOneUser/:id', userController.getOneUser)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/review', userController.review)


router.get('/:id')
module.exports = router
