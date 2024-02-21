const {PositionCity} = require('../models')

module.exports.checkPosition = async function (req, res, next) {
    const positionHeader = req.headers['position']
    const positionCookie = req.cookies['position']
    const position = positionCookie || positionHeader && positionHeader.split(' ')[1]
    if (position == null) {
        req.position = 'Казань'
        return next()
    }
    const city = await PositionCity.findAll({
        where: {citySlug: positionCookie || positionHeader},
        raw: true
    })
    if (city.length > 0) {
        req.position = city[0].name;
        return next()
    } else {
        req.position = 'Казань'
        return next()
    }
}
