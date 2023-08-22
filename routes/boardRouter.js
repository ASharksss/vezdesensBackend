const Router = require('express')
const router = new Router()
const boardController = require('../controllers/boardController')

router.get('/getAll', boardController.getAll)