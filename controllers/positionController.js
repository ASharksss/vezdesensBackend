const { Op } = require("sequelize")
const ApiError = require("../error/ApiError");
const {PositionCity} = require('../models')

class PositionController {
	async search(req, res, next) {
		try {
			const {query=''} = req.body
			let queryFiltered;
			if(query.indexOf(',') > 0)
				queryFiltered = query.split(',');

			const result = await PositionCity.findAll({
				where: {name:{
						[Op.like]: queryFiltered !== undefined ?
								`%${queryFiltered[0].trim()}%`
								: `%${query.trim()}%`}
				},
				attributes: ['name', 'latitude', 'longitude'],
				limit: queryFiltered !== undefined ? 1 : 5
			})
			return res.json(result)
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new PositionController()
