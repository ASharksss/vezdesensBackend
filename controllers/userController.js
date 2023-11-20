const ApiError = require("../error/ApiError");
const {Op, literal, fn, col} = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Rating, Ad, Favorite, StatusAd, TypeAd, Objects, AdView} = require('../models')


const generateAccessToken = async (id) => {
  let date = new Date()
  return jwt.sign({id, exp: date.setDate(date.getDate() + 365)}, process.env.SECRET_KEY);
}

class UserController {

  async check(req, res, next) {
    const {token} = req.query
    if (!token) {
      return next(ApiError.badRequest('Не задан токен'))
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
      if (err) {
        return next(ApiError.badRequest('Неправильный токен или он просрочен'))
      }
      const userDB = await User.findOne({
        where: {id: user.id},
        attributes: ['name', 'login', 'email', 'id', 'createdAt', 'phone'],
        raw: true
      })
      return res.json({token, username: userDB.login, profile: userDB})
    })
  }

  async registration(req, res, next) {
    try {
      const {name, email, phone, login, password} = req.body
      const hashPassword = await bcrypt.hash(password, 10)
      const user = await User.findOrCreate({
        where: {
          [Op.or]: [{email}, {login}]
        },
        defaults: {email, login, name, phone, password: hashPassword}
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
      const {email, login, password} = req.body
      let user = null
      if (login === undefined) {
        user = await User.findOne({
          where: {email},
          raw: true
        })
      } else if (email === undefined) {
        user = await User.findOne({
          where: {login},
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
      const token = await generateAccessToken(user.id);
      delete user.password
      delete user.updatedAt
      return res.json({token, username: user.login, profile: user});
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async review(req, res, next) {
    try {
      const {sellerId, grade, text} = req.body
      const customerId = req.user
      if (customerId === null){
        return res.json(ApiError.forbidden('Ошибка токена'))
      }
      let review = await Rating.create({customerId, sellerId, grade, text})
      return res.json(review)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id
      let user = await User.findOne({
        where: {id},
        include: [{
          model: Ad,
					include: [{model: TypeAd}, {model: StatusAd}, {model: Objects}, {model: Favorite, attributes: ['id']}]
        },{
					model: Rating,
					attributes: ['id', 'text', 'grade', 'createdAt'],
					include: {
						model: User,
						attributes: ['id', 'name']
					}
				}]
      })
			for (let i=0; i< user.dataValues.ads.length; i++) {
				if (user.dataValues.ads[i].dataValues.favorites.length > 0){
					user.dataValues.ads[i].dataValues.favoritesCount = user.dataValues.ads[i].dataValues.favorites.length
				} else {
					user.dataValues.ads[i].dataValues.favoritesCount = 0
				}
			}
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getArchiveAds(req, res, next) {
    try {
      const id = req.params.id
      let user = await Ad.findOne({
        where: [{userId: id}, {statusAdId: 4}]
      })
      return res.json(user)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}


module.exports = new UserController()