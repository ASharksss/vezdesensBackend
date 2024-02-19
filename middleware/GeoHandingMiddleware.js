module.exports.checkPosition = function (req, res, next) {
    const positionHeader = req.headers['position']
    const positionCookie = req.cookies['position']
    const position = positionCookie || positionHeader && positionHeader.split(' ')[1]
    if (position == null) {
        req.position = 'Казань'
        return next()
    }
    req.position = positionCookie || positionHeader
    return next()
}
