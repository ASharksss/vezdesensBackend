const ApiError = require("../error/ApiError");
const {Ad} = require('../models')

class AdController {
    async createAd(req, res, next) {
        try {
            const {
                title, price, description,
                address, longevity, userId,
                typeAdId, statusAdId, objectId
            } = req.body
            const ad = await Ad.create({
                title,
                price,
                description,
                address,
                longevity,
                userId,
                typeAdId,
                statusAdId,
                objectId
            })
            return res.json(ad);
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async editAd(req, res) {

    }

    async deleteAd(req, res) {

    }

}

module.exports = new AdController()