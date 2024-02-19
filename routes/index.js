const Router = require('express')
const router = new Router()


const adRouter = require('./adRouter')
const boardRouter = require('./boardRouter')
const chatRouter = require('./chatRouter')
const geoRouter = require('./geoRouter')
const userRouter = require('./userRouter')
const positionRouter = require('./positionRouter')
const CategoriesRouter = require('./admin/CategoriesRouter')
const characteristicRouter = require('./admin/CharacteristicRouter')
const otherRouter = require('./otherRouter')
const searchRouter = require('./searchRouter')
const supportRouter = require('./supportRouter')
const auth = require('../middleware/AuthHandingMiddleware')


router.use('/user', userRouter)
router.use('/ad', adRouter)
router.use('/categories', CategoriesRouter)
router.use('/characteristic', characteristicRouter)
router.use('/board', auth.isAuthorized, boardRouter)
router.use('/search', searchRouter)
router.use('/chat', auth.isAuthorized, chatRouter)
router.use('/other', otherRouter)
router.use('/geo', geoRouter)
router.use('/position', positionRouter)
router.use('/support', supportRouter)


module.exports = router

