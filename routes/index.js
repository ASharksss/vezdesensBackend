const Router = require('express')
const router = new Router()


const adRouter = require('./adRouter')
const boardRouter = require('./boardRouter')
const chatRouter = require('./chatRouter')
const geoRouter = require('./geoRouter')
const userRouter = require('./userRouter')
const CategoriesRouter = require('./admin/CategoriesRouter')
const characteristicRouter = require('./admin/CharacteristicRouter')
const auth = require('../middleware/AuthHandingMiddleware')


router.use('/user', userRouter)
router.use('/ad', auth.isAuthorized, adRouter)
router.use('/categories', CategoriesRouter)
router.use('/characteristic', characteristicRouter)
router.use('/board', boardRouter)
router.use('/chat', auth.isAuthorized, chatRouter)


module.exports = router

