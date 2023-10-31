const ApiError = require("../error/ApiError");
const {User, Rating} = require('../models')

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
      const {customerId, sellerId, grade, text} = req.body
      let review = await Rating.create({customerId, sellerId, grade, text})
      return res.json(review)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneUser(req, res, next) {
    try {
      const {userId} = req.query
      let user = await User.findAll({
        where: {id: userId},
        include: {
          model: Rating, where: {sellerId: userId}
        }
      })

      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}

module.exports = new UserController()