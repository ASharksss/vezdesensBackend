const ApiError = require("../error/ApiError");
const {User} = require('../models')

class UserController {

  async check(req, res, next) {
    const {id} = req.query
    if (!id) {
      return next(ApiError.badRequest('Не задан ID'))
    }
    res.json(id)
  }

  async registration(req, res, next) {
    try {
      const {name, email, phone, login, password} = req.body
      const user = await User.create({name, email, phone, login, password})
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async login(req, res) {

  }

  async review(req, res, next) {
    try {
      const {myId, sellerId, grade, text} = req.body
      

    } catch (e) {

    }
  }

}

module.exports = new UserController()