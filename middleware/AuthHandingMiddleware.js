const jwt = require('jsonwebtoken');

module.exports.isAuthorized  = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const authCookie = req.cookies['session']
    const token = authCookie || authHeader && authHeader.split(' ')[1]
    if (token == null) {
        req.user = null
        return next()
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        req.user = user.id
        return next()
    })
}