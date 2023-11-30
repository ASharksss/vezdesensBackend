const ApiError = require("../error/ApiError");
const {PositionRegion, PositionCity, PositionDistrict} = require('../models')

class PositionController {
	async postRegion(req, res, next) {
		try {
			const {name, parentId} = req.body
			await PositionRegion.findOrCreate({
				where: {name},
				defaults: {name, positionDistrictId: parentId}
			})
			return 'done'
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}
	async postCity(req, res, next) {
		try {
			const {name, parentId, latitude, longitude} = req.body
			await PositionCity.findOrCreate({
				where: {name},
				defaults: {name, positionRegionId: parentId, latitude, longitude}
			})
			return 'done'
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new PositionController()
