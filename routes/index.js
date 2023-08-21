const Router = require('express')
const router = new Router()


const adRouter = require('./adRouter')
const boardRouter  = require('./boardRouter')
const chatRouter = require('./chatRouter')
const geoRouter = require('./geoRouter')
const userRouter = require('./userRouter')


router.use('/user', userRouter)
router.use('/ad', adRouter)


module.exports = router

