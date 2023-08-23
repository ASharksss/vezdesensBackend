const Router = require('express')
const router = new Router()


const adRouter = require('./adRouter')
const boardRouter  = require('./boardRouter')
const chatRouter = require('./chatRouter')
const geoRouter = require('./geoRouter')
const userRouter = require('./userRouter')
const CategoriesRouter = require('./CategoriesRouter')


router.use('/user', userRouter)
router.use('/ad', adRouter)
router.use('/categories', CategoriesRouter)
router.use('/board', boardRouter)


module.exports = router

