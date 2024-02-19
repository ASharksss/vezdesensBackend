const ApiError = require('../error/ApiError');
const {PositionCity, PositionRegion, PositionDistrict} = require('../models')

class GeoController {
    async getCity(req, res, next) {
        try {
            const districts = await PositionDistrict.findAll({
                attributes: ['id', 'name']
            })
            const regions = await PositionRegion.findAll({
                attributes: ['id', 'name', 'positionDistrictId']
            })
            const cities = await PositionCity.findAll({
                attributes: ['id', 'name', 'citySlug', 'latitude', 'longitude', 'positionRegionId']
            })
            const data = {
                districts,
                regions,
                cities
            }
            return res.json(data)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest('Ошибка обработки сервера'))
        }
    }
}

module.exports = new GeoController()
