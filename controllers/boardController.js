const ApiError = require('../error/ApiError')
const {Ad} = require('../models')


class BoardController {

    async getAll(req, res, next) {
        try {
            const {subCategoryId, objectId} = req.query
            let ads
            if (!subCategoryId && !objectId) {
                ads = await Ad.findAll()
            }
            if (subCategoryId && !objectId) {
                ads = await Ad.findAll({where: subCategoryId})
            }
            if (!subCategoryId && objectId) {
                ads = await Ad.findAll({where: objectId})
            }
            if (subCategoryId && objectId) {
                ads = await Ad.findAll({where: {subCategoryId, objectId}})
            }

            return res.json(ads)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new BoardController()
