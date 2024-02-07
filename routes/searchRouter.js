const Router = require('express')
const router = new Router()
const searchController = require('../controllers/searchController')
const auth = require("../middleware/AuthHandingMiddleware");

router.get('/', auth.isAuthorized, searchController.search)

module.exports = router
