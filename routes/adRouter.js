const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.post('/')
router.get('/', (req, res) => {
    res.json({message: 'Роутер объявлений'})
})
router.get('/:id')
router.delete('/:id')

module.exports = router
