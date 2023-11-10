const ApiError = require("../error/ApiError");
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Rating, Ad, Favorite, StatusAd, TypeAd } = require('../models')


const generateAccessToken = async (id) => {
  return jwt.sign(id, process.env.SECRET_KEY, { expiresIn: '365d' });
}
class UserController {

  async check(req, res, next) {
    const { id } = req.query
    if (!id) {
      return next(ApiError.badRequest('Не задан ID'))
    }
    res.json(id)
  }

  async registration(req, res, next) {
    try {
      const { name, email, phone, login, password } = req.body
      const hashPassword = await bcrypt.hash(password, 10)
      const user = await User.findOrCreate({
        where: {
          [Op.or]: [{ email }, { login }]
        },
        defaults: { email, login, name, phone, password: hashPassword }
      }).catch(err => {
        console.log('Error', err)
        return next(ApiError.badRequest(err))
      }).then((data) => {
        const [result, created] = data
        if (!created) {
          return next(ApiError.forbidden("Почта или логин заняты!"))
        }
        return result
      })
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async login(req, res, next) {
    try {
      const { email, login, password } = req.body
      let user = null
      if (login === undefined) {
        user = await User.findOne({
          where: { email },
          raw: true
        })
      } else if (email === undefined) {
        user = await User.findOne({
          where: { login },
          raw: true
        })
      }
      if (user === null) {
        return next(ApiError.badRequest('Пользователь не найден'))
      }
      let comparePassword = bcrypt.compareSync(password, user.password)
      if (!comparePassword) {
        return next(ApiError.forbidden('Неверный пароль'))
      }
      const token = await generateAccessToken({ id: user.id });
      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async review(req, res, next) {
    try {
      const { customerId, sellerId, grade, text } = req.body
      let review = await Rating.create({ customerId, sellerId, grade, text })
      return res.json(review)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id
      let user = await User.findOne({
        where: { id },
        include: {
          model: Ad, include: [{ model: TypeAd }]
        }
      })
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getArchiveAds(req, res, next) {
    try {
      const id = req.params.id
      let user = await Ad.findOne({
        where: [{ userId: id }, { statusAdId: 4 }]
      })
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}



module.exports = new UserController()