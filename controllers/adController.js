const uuid = require('uuid')
const path = require('path')
const ApiError = require("../error/ApiError");
const {
	Ad,
	TypeAd,
	Booking,
	AdView,
	Favorite, ImageAd,
	AdCharacteristicInput, AdCharacteristicSelect, User, Rating, StatusAd, Objects, Characteristic, CharacteristicValue, PreviewImageAd,
} = require('../models')
const {Op} = require("sequelize");

class AdController {

	async createAd(req, res, next) {

		try {
			const {
				title, price, description,
				address, longevity,
				typeAd, statusAdId, objectId,
				bookingDateStart, bookingDateEnd, characteristicsInput,
				characteristicsSelect
			} = req.body

			const {images} = req.files
			const {previewImage} = req.files

			const userId = req.user

			if (userId === null || userId === undefined) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}

			let priceTypeAd, ad, time, cost, booking, characterInput, characterSelect
			const currentDate = new Date()
			const typeAdBD = await TypeAd.findOne({where: {size: typeAd}, raw: true})
			const typeAdId = typeAdBD.id
			//Бронирование дорогих плашек
			if (typeAdId === 2 || typeAdId === 3 || typeAdId === 4) {

				//Вытаскиваем стоимость за 1 день
				priceTypeAd = await TypeAd.findByPk(typeAdId, {
					attributes: ['price']
				})
				
				//Проверка дат
				if (new Date(bookingDateStart) < currentDate || new Date(bookingDateEnd) < new Date(bookingDateStart)) {
					return next(ApiError.badRequest('Некорректно введены даты'))
				} else {
					//Определяем срок бронирования
					time = (new Date(bookingDateEnd) - new Date(bookingDateStart)) / 1000 / 60 / 60 / 24

					//Определяем стоимость бронирования
					cost = time * priceTypeAd.price

					//Тут функция оплаты

					//Создаем объявление
					ad = await Ad.create({
						title, price, description,
						address, longevity, userId,
						typeAdId, statusAdId, objectId,
						dateEndActive: new Date(currentDate.setDate(currentDate.getDate() + 30)) //Дата окончания показов
					})

					await ad.save()

					//Запись характеристик enter
					JSON.parse(characteristicsInput).map(async (item) => {
						characterInput = await AdCharacteristicInput.create({
							adId: ad.dataValues.id,
							characteristicId: item.id,
							value: item.value
						})
					})
					//Запись характеристик Checkbox & Radio
					JSON.parse(characteristicsSelect).map(async (item) => {
						item.value.map(async (value) => {
							try {
								characterSelect = await AdCharacteristicSelect.create({
									adId: ad.dataValues.id,
									characteristicId: item.id,
									characteristicValueId: value
								})
								await characterSelect.save()
							} catch (e) {
								return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
							}
						})
					})

					//Запись бронирования
					await Booking.create({
						userId, typeAdId, adId: ad.id, dateStart: bookingDateStart, dateEnd: bookingDateEnd, cost
					})
				}

				let previewName = uuid.v4() + '.jpg'
				await previewImage.mv(path.resolve(__dirname, '..', 'static', previewName))
				await PreviewImageAd.create({adId: ad.id, name: previewName})

			} else {
				// Создаем объявление без брони
				ad = await Ad.create({
					title, price, description,
					address, longevity, userId,
					typeAdId, statusAdId, objectId,
					dateEndActive: new Date(currentDate.setDate(currentDate.getDate() + 30)) //Дата окончания показов
				})

				await ad.save()

				//Запись характеристик enter
				JSON.parse(characteristicsInput).map(async (item) => {
					characterInput = await AdCharacteristicInput.create({
						adId: ad.dataValues.id,
						characteristicId: item.id,
						value: item.value
					})
				})
				//Запись характеристик Checkbox & Radio
				JSON.parse(characteristicsSelect).map(async (item) => {
					item.value.map(async (value) => {
						try {
							characterSelect = await AdCharacteristicSelect.create({
								adId: ad.dataValues.id,
								characteristicId: item.id,
								characteristicValueId: value
							})
							await characterSelect.save()
						} catch (e) {
							return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
						}
					})
				})
			}

			if (images.length === undefined) {
				let fileName = uuid.v4() + '.jpg'
				await images.mv(path.resolve(__dirname, '..', 'static', fileName))
				await ImageAd.create({adId: ad.id, name: fileName})
			} else {
				images.map(async (image) => {
					let fileName = uuid.v4() + '.jpg'
					await image.mv(path.resolve(__dirname, '..', 'static', fileName))
					await ImageAd.create({adId: ad.id, name: fileName})
				})
			}
			return res.json({ad});
		} catch (e) {
			return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
		}
	}

	async getOneAd(req, res, next) {
		try {
			const adId = req.params.id
			const userId = req.user

			let view, ad

			if (userId !== null) {
				//Достаем объявление
				ad = await Ad.findOne({
					where: [{id: adId}],
					include: [{
						model: AdCharacteristicInput,
						attributes: ['id', 'value'],
						required: false,
						include: {
							model: Characteristic,
							attributes: ['name']
						}
					}, {
						model: AdCharacteristicSelect,
						attributes: ['id'],
						required: false,
						include: [{
							model: Characteristic,
							attributes: ['name']
						}, {
							model: CharacteristicValue,
							attributes: ['name']
						}]
					}, {
						model: AdView
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: User,
						include: {
							model: Rating,
							attributes: ['id', 'text', 'grade', 'customerId', 'createdAt'],
							include: {
								model: User
							}
						}
					}, {
						model: ImageAd,
						required: false
					}]
				})
			} else {
				//Достаем объявление
				ad = await Ad.findOne({
					where: [{id: adId}],
					include: [{
						model: AdCharacteristicInput,
						attributes: ['id', 'value'],
						required: false,
						include: {
							model: Characteristic,
							attributes: ['name']
						}
					}, {
						model: AdCharacteristicSelect,
						attributes: ['id'],
						required: false,
						include: [{
							model: Characteristic,
							attributes: ['name']
						}, {
							model: CharacteristicValue,
							attributes: ['name']
						}]
					}, {
						model: AdView
					}, {
						model: Favorite,
						required: false
					}, {
						model: User,
						include: {
							model: Rating,
							attributes: ['id', 'text', 'grade', 'customerId', 'createdAt'],
							include: {
								model: User
							}
						}
					}, {
						model: ImageAd,
						required: false
					}]
				})
			}

			//Получение просмотров по объявлению
			const viewsOfAd = await AdView.findAndCountAll({
				where: {adId}
			})
			//Количество просмотров
			const viewsCount = viewsOfAd.count

			if (userId !== null) {
				//Все просмотры по объявлению
				const tableViews = await AdView.findOne({
					where: {
						[Op.and]: [{adId, userId}]
					}
				})

				//Если совпадение не найдено - создаем
				if (!tableViews) {
					view = await AdView.create({
						userId,
						adId
					})
					view.save()
				}
			}

			let today = new Date()
			today.setUTCHours(0, 0, 0, 0)
			today = today.toISOString().split('T')[0]
			const {count, rows} = await AdView.findAndCountAll({
				where: [{adId}, {createdAt: {
						[Op.and]: {
							[Op.gte]: today + ' 00:00:00',
							[Op.lte]: today + ' 23:59:59.999999',
						}
					}}]
			})

			await Ad.update({views: viewsCount}, {where: {id: adId}})
			delete ad.dataValues.adViews
			ad.dataValues.viewsToday = count

			return res.json({ad})
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}

	}

	async inFavorite(req, res, next) {
		try {
			const {adId} = req.query
			const userId = req.user
			if (userId === null) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}
			const favoritesOfUser = await Favorite.findOrCreate({
				where: {adId, userId}
			})
			return res.json(favoritesOfUser)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async adArchive(req, res, next) {
		try {
			const adId = req.params.id
			const userId = req.user
			if (userId === null) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}
			await Ad.update({statusAdId: 4}, {where: {id: adId}})
			const ads = await Ad.findAll({
				where: {userId},
				include: [{model: TypeAd}, {model: StatusAd}, {model: Objects},
					{model: Favorite, attributes: ['id']}, {model: ImageAd, required: false}]
			})
			for (let i = 0; i < ads.length; i++) {
				if (ads[i].dataValues.favorites.length > 0) {
					ads[i].dataValues.favoritesCount = ads[i].dataValues.favorites.length
					delete ads[i].dataValues.favorites
				} else {
					ads[i].dataValues.favoritesCount = 0
				}
			}
			return res.json(ads)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async adPublish(req, res, next) {
		try {
			const adId = req.params.id
			const userId = req.user
			if (userId === null) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}
			await Ad.update({statusAdId: 2}, {where: {id: adId}})
			const ads = await Ad.findAll({
				where: {userId},
				include: [{model: TypeAd}, {model: StatusAd}, {model: Objects},
					{model: Favorite, attributes: ['id']}, {model: ImageAd, required: false}]
			})
			for (let i = 0; i < ads.length; i++) {
				if (ads[i].dataValues.favorites.length > 0) {
					ads[i].dataValues.favoritesCount = ads[i].dataValues.favorites.length
					delete ads[i].dataValues.favorites
				} else {
					ads[i].dataValues.favoritesCount = 0
				}
			}
			return res.json(ads)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async removeFavorite(req, res, next) {
		try {
			const {adId} = req.query
			const userId = req.user
			if (userId === null) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}
			await Favorite.destroy({
				where: {adId, userId}
			})
			let favorite = await Favorite.findAll({
				where: {userId},
				include: {
					model: Ad,
					include: [{model: StatusAd}, {model: Objects}, {model: ImageAd, required: false}, {model: User}]
				}
			})
			return res.json(favorite)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async removeAd(req, res, next) {
		try {
			const {adId} = req.query
			const userId = req.user
			if (userId === null) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}
			await Ad.update({statusAdId: 1}, {where: {id: adId}})
			const ads = await Ad.findAll({
				where: {userId},
				include: [{model: TypeAd}, {model: StatusAd}, {model: Objects},
					{model: Favorite, attributes: ['id']}, {model: ImageAd, required: false}]
			})
			for (let i = 0; i < ads.length; i++) {
				if (ads[i].dataValues.favorites.length > 0) {
					ads[i].dataValues.favoritesCount = ads[i].dataValues.favorites.length
					delete ads[i].dataValues.favorites
				} else {
					ads[i].dataValues.favoritesCount = 0
				}
			}
			return res.json(ads)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async searchAd(req, res, next) {
		try {
			const {query} = req.query
			const ads = await Ad.findAll({
				where: {
					title: {[Op.like]: `%${query}%`}
				},
				include: [{
					model: ImageAd,
					required: false
				}]
			})
			return res.json(ads)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getBookingInfo(req, res, next) {
		try {
			const {name} = req.query
			const bookingInfo = await TypeAd.findAll({where: {size: name}})
			return res.json(bookingInfo)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async editAd(req, res) {

	}

	async deleteAd(req, res) {

	}


}

module.exports = new AdController()