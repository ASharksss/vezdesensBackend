const {PositionCity} = require('../models')

module.exports.checkPosition = async function (req, res, next) {
    const positionHeader = req.headers['x-position']
    const positionCookie = req.cookies['position']
    let positionSlug = positionCookie || positionHeader
    if (positionSlug === null || positionSlug === undefined) {
        req.position = 'Казань'
        positionSlug = 'kazan'
    }
    const city = await PositionCity.findAll({
        where: {citySlug: positionSlug},
        raw: true
    })
    const allCityInRegion = await PositionCity.findAll({
        where: {positionRegionId: city[0].positionRegionId},
        attributes: ['name'],
        raw: true
    })
    if (city.length > 0) {
        req.position = city[0].name;
        let cities = allCityInRegion.map(item => item.name)
        cities.push('Россия')
        req.cities = cities;
        return next()
    } else {
        req.position = 'Казань'
        const allCityInRegion = await PositionCity.findAll({
            where: {positionRegionId: 19},
            attributes: ['name'],
            raw: true
        })
        let cities = allCityInRegion.map(item => item.name)
        cities.push('Россия')
        req.cities = cities;
        return next()
    }
}
