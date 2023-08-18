const Router = require('express')
const router = new Router()


const adRouter = require('./adRouter')
const authRouter = require('./adRouter')
const boardRouter  = require('./adRouter')
const chatRouter = require('./adRouter')
const geoRouter = require('./adRouter')
const userRouter = require('./adRouter')


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/ad', adRouter)
router.use('/board', boardRouter)
router.use('/chat', chatRouter)
router.use('/geo', geoRouter)


module.exports = router

