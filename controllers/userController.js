const {Op} = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const ApiError = require("../error/ApiError");
const {User, Rating, Ad, Favorite, ImageAd,
	StatusAd, TypeAd, Objects, AdView, UserAvatar
} = require('../models')
const {HTML_REGISTRATION, transporter} = require("../utils");


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
          [Op.or]: [{email}, {login}, {phone}]
        },
        defaults: {email, login, name, phone, password: hashPassword},
        raw: true
      }).catch(err => {
        console.log('Error', err)
        return next(ApiError.badRequest(err))
      }).then((data) => {
        const [result, created] = data
        if (!created) {
          return next(ApiError.forbidden("Почта, логин или телефон уже заняты!"))
        }
        return result
      })
			if (user !== undefined) {
				const EMAIL_USER = process.env.EMAIL_USER
				const mailOptions = {
					from: EMAIL_USER,
					to: email,
					subject: 'Регистрация на сайте',
					html: HTML_REGISTRATION(login, phone)
				};
				await transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			}
      const token = await generateAccessToken(user.id);
      return res.json({token, username: user.login, profile: user})
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
      await Rating.create({customerId, sellerId, grade, text})
			let reviews = await Rating.findAll({
				where: {sellerId},
				attributes: ['id', 'createdAt', 'grade', 'text'],
				include: [{
					model: User,
					attributes: ['id', 'login', 'name']
				}]
			})
      return res.json(reviews)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getUserReview(req, res, next) {
    try {
      const {id} = req.params
      let reviews = await Rating.findAll({
				where: {sellerId: id},
				attributes: ['id', 'createdAt', 'grade', 'text'],
				include: [{
					model: User,
					attributes: ['id', 'login', 'name']
				}]
			})
      return res.json(reviews)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id
      let user = await User.findOne({
        where: {id},
				attributes: ['id', 'login', 'email', 'createdAt', 'name', 'phone'],
        include: [{
					model: UserAvatar,
					attributes: ['name'],
					required: false
				},{
            model: Ad,
            include: [{model: TypeAd}, {model: StatusAd}, {model: Objects},
							{model: Favorite, attributes: ['id']}, {model: ImageAd, required: false}]
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
								delete user.dataValues.ads[i].dataValues.favorites
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
  async getFavorite(req, res, next) {
    try {
      const userId = req.user
      if (userId === null || userId === undefined) {
        return res.json(ApiError.forbidden('Ошибка токена'))
      }
      let favorite = await Favorite.findAll({
        where: {userId},
        include: {
          model: Ad,
          include: [{model: StatusAd}, {model: Objects}, {model: ImageAd, required: false}, {
						model: User,
						attributes: ["name", "phone"]
					}]
        }
      })
      return res.json(favorite)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
	async editInfo(req, res, next) {
    try {
      const userId = req.user
      if (userId === null || userId === undefined) {
        return res.json(ApiError.forbidden('Ошибка токена'))
      }
			const { name, phone, email } = req.body
			const { avatar } = req.files
			await User.update({name, phone, email}, {
				where: {id: userId}
			})
			const avatarDB = await UserAvatar.findOne({
				where: {userId},
				raw: true
			})
			if (avatarDB !== null) {
				let fileName = avatarDB.name
				const filePath = path.resolve(__dirname, '..', 'static/avatar', fileName);
				await fs.unlink(filePath, (err) => {
					if (err) {
						console.error('Ошибка при удалении файла:', err);
					} else {
						console.log('Файл успешно удален');
					}
				});
				await UserAvatar.destroy({
					where: {userId}
				})
			}
			let fileName = uuid.v4() + '.jpg'
			await avatar.mv(path.resolve(__dirname, '..', 'static/avatar', fileName))
			await UserAvatar.create({userId, name: fileName})
			res.json({message: 'done'})
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}


module.exports = new UserController()