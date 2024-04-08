const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const ApiError = require("../error/ApiError");
const {
	Ad, TypeAd, Booking,
	AdView, Favorite, ImageAd,
	AdCharacteristicInput, AdCharacteristicSelect, User,
	Rating, StatusAd, Objects,
	Characteristic, CharacteristicValue, PreviewImageAd,
	CharacteristicObject, TypeCharacteristic, SubCategory,
	Category, CommercialImageAd
} = require('../models');
const {Op} = require("sequelize");
const {resizeImage, postData, receipt} = require("../utils");
const crypto = require("crypto");

class AdController {

	async createAd(req, res, next) {
		try {
			let {
				title, price, description, address, longevity, showPhone,
				typeAd, statusAdId, objectId, bookingDateStart, bookingDateEnd,
				characteristicsInput, characteristicsSelect, position
			} = req.body

			const {images} = req.files
			const {previewImage} = req.files
			const {commercialImage} = req.files

			const userId = req.user

			if (userId === null || userId === undefined) {
				return res.json(ApiError.forbidden('Ошибка токена'))
			}

			let priceTypeAd, ad, time, cost, characterInput, characterSelect
			const currentDate = new Date()
			currentDate.setHours(0, 0, 0, 0)
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
					time = ((new Date(bookingDateEnd) - new Date(bookingDateStart)) / 1000 / 60 / 60 / 24) - 1

					//Определяем стоимость бронирования
					cost = time * priceTypeAd.price

					//Тут функция оплаты
					statusAdId = 5
					//Создаем объявление
					ad = await Ad.create({
						title, price, description, showPhone, objectId,
						address, longevity, userId, typeAdId, statusAdId,
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
						if (Array.isArray(item.value)) {
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
						} else {
							try {
								characterSelect = await AdCharacteristicSelect.create({
									adId: ad.dataValues.id,
									characteristicId: item.id,
									characteristicValueId: item.value
								})
								await characterSelect.save()
							} catch (e) {
								return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
							}
						}
					})

					//Запись бронирования
					await Booking.create({
						userId, typeAdId, adId: ad.id, dateStart: bookingDateStart, dateEnd: bookingDateEnd, cost, position
					})

					let previewName = typeAdId === 2 ? 'stPl/' : typeAdId === 3 ? 'vp/' : 'premium/';
					let cardType = typeAdId === 2 ? 'stPl' : typeAdId === 3 ? 'vp' : 'premium';
					previewName = previewName + uuid.v4() + '.webp';
					await resizeImage(commercialImage.data, previewName, cardType)
					await CommercialImageAd.create({adId: ad.id, name: previewName})
				}
			} else {
				// Создаем объявление без брони
				ad = await Ad.create({
					title, price, description, showPhone, address,
					longevity, userId, typeAdId, statusAdId, objectId,
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
					if (Array.isArray(item.value)) {
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
					} else {
						try {
							characterSelect = await AdCharacteristicSelect.create({
								adId: ad.dataValues.id,
								characteristicId: item.id,
								characteristicValueId: item.value
							})
							await characterSelect.save()
						} catch (e) {
							return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
						}
					}
				})
			}

			let previewName = 'st/pv/' + uuid.v4() + '.webp'
			await resizeImage(previewImage.data, previewName, 'st')
			await PreviewImageAd.create({adId: ad.id, name: previewName})

			if (images.length === undefined) {
				let fileName = uuid.v4() + '.webp'
				await resizeImage(images.data, fileName, 'card')
				await ImageAd.create({adId: ad.id, name: fileName})
			} else {
				images.map(async (image) => {
					let fileName = uuid.v4() + '.webp'
					await resizeImage(image.data, fileName, 'card')
					await ImageAd.create({adId: ad.id, name: fileName})
				})
			}
			return res.json({ad});
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
		}
	}

	async getOneAd(req, res, next) {
		try {
			const adId = req.params.id
			const userId = req.user

			let view, ad

			ad = await Ad.findOne({
				where: [{id: adId}],
				include: [{
					model: Objects,
					attributes: ['id', 'name'],
					include: [{
						model: SubCategory,
						attributes: ['id', 'name'],
						include: [{
							model: Category,
							attributes: ['id', 'name']
						}]
					}]
				}, {
					model: AdCharacteristicInput,
					attributes: ['id', 'value'],
					required: false,
					include: {
						model: Characteristic,
						attributes: ['name', 'required']
					}
				}, {
					model: AdCharacteristicSelect,
					attributes: ['id'],
					required: false,
					include: [{
						model: Characteristic,
						attributes: ['name', 'required']
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
					attributes: ['id', 'phone', 'name', 'createdAt', 'companyName', 'isCompany', 'showPhone'],
					include: {
						model: Rating,
						attributes: ['id', 'text', 'grade', 'customerId', 'createdAt'],
						include: {
							model: User,
							attributes: ['id', 'login', 'createdAt', 'phone', 'name']
						}
					}
				}, {
					model: ImageAd,
					required: false
				}, {
					model:  TypeAd,
					attributes: ['id', 'name']
				}]
			})

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

			if (userId !== null) {
				if (ad.dataValues.typeAd.dataValues.id !== 1) {
					let booking = undefined
					const currentDate = new Date().setHours(15, 0, 0, 0)
					if (userId) {
						booking = await Booking.findOne({
							where: {adId},
							attributes: ['id', 'cost', 'userId'],
							include: {
								model: Ad,
								attributes: ['id'],
								where: {
									[Op.or]: [
										{statusAdId: 3},
										{statusAdId: 5}
									]
								}
							},
							raw: true
						})
					}
					if (booking === undefined || userId === null || (booking !== null && booking['userId'] !== userId)) {
						return next(ApiError.forbidden('Нет доступа'))
					} else {
						const bookings = await Booking.findAll({
							where: {userId},
							include: [{
								model: Ad,
								attributes: ['id'],
								where: {statusAdId: 5}
							}, {
								model: TypeAd,
								attributes: ['price']
							}],
							raw: true
						})
						for (let i = 0; i < bookings.length; i++) {
							if (new Date(bookings[i]['dateStart']) <= currentDate && new Date(bookings[i]['dateEnd']) > currentDate) {
								const time = (new Date(bookings[i]['dateEnd']) - currentDate) / 1000 / 60 / 60 / 24
								const cost = time * bookings[i]['typeAd.price']
								bookings[i]['cost'] = cost
								bookings[i]['dateStart'] = currentDate
								await Booking.update({cost, dateStart: currentDate}, {
									where: {id: bookings[i]['id']}
								})
							} else {
								const adId = bookings[i]['adId']
								await Ad.update({statusAdId: 3}, {where: {id: adId}})
							}
						}
					}
					if (booking !== null) {
						const robokassIsTest = process.env.ROBOKASSA_IS_TEST || 1
						const robokassaLogin = process.env.ROBOKASSA_LOGIN
						const robokassaPassword = process.env.ROBOKASSA_PASSWORD_1
						const receiptData = receipt(ad.dataValues.typeAd.dataValues.name, booking['cost'])
						const receiptURLEncode = encodeURIComponent(JSON.stringify(receiptData)).replace(/%3A/g, ":").replace(/%2C/g, ",")
						let crcData = `${robokassaLogin}:${booking['cost']}:${booking['id']}:${receiptURLEncode}:${robokassaPassword}`
						const crc = crypto.createHash('md5').update(crcData).digest("hex");
						const invoice = await postData(robokassaLogin, booking['cost'], booking['id'], receiptURLEncode, crc, ad.dataValues.user.dataValues.email, robokassIsTest)
							.then(async data => {
								return data?.invoiceID;
							})
							.catch(error => {
								console.error('Ошибка при выполнении запроса:', error);
							});
						ad.dataValues.payment = {
							cost: booking['cost'],
							href: `https://auth.robokassa.ru/Merchant/Index/${invoice}`
						}
					}
				}
			}

			if (!ad?.user.showPhone) delete ad?.user.dataValues.phone
			if (!ad?.user.isCompany) delete ad?.user.dataValues.companyName
			delete ad?.user.dataValues.showPhone

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
			console.log(e)
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
			const currentDate = new Date()
			currentDate.setHours(0, 0, 0, 0)
			await Ad.update({statusAdId: 4, dateEndActive: currentDate}, {where: {id: adId, userId}})
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
			const dateEndActive = new Date()
			dateEndActive.setHours(15,0,0,0)
			dateEndActive.setDate(dateEndActive.getDate() + 30)
			await Ad.update({statusAdId: 2, dateEndActive}, {where: {id: adId}})
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
					include: [{model: StatusAd}, {model: Objects}, {model: ImageAd, required: false}, {
						model: User, attributes: ['id', 'login', 'createdAt', 'phone', 'name']}]
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
			await Booking.destroy({ where: {adId} })
			await PreviewImageAd.destroy({ where: {adId} })
			await ImageAd.destroy({ where: {adId} })
			await CommercialImageAd.destroy({ where: {adId} })
			await AdCharacteristicInput.destroy({ where: {adId} })
			await AdCharacteristicSelect.destroy({ where: {adId} })
			await AdView.destroy({ where: {adId} })
			await Favorite.destroy({ where: {adId} })
			await Ad.destroy({ where: {id: adId} })
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
			const cities = req.cities
			const ads = await Ad.findAll({
				where: {
					title: {[Op.like]: `%${query}%`},
					statusAdId: 2,
					address: cities !== undefined && {
						[Op.or]: cities.map(name => ({ [Op.like]: `%${name}%` }))
					}
				},
				include: [{
					model: PreviewImageAd,
					required: false
				}]
			})
			return res.json(ads)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getPremiumDate(req, res, next) {
		try {
			const {position} = req.query
			const booking = await Booking.findAll({
				where: [{isActive: true}, {position}, {typeAdId: 4}],
				attributes: ['dateStart', 'dateEnd'],
				raw: true
			})
			return res.json(booking)
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

	async getEditAd(req, res, next) {
		try {
			const {id} = req.params
			const userId = req.user
			if (userId === null) {
				return next(ApiError.forbidden('Нет доступа'))
			}
			const ad = await Ad.findOne({
				where: [{id}, {userId}],
				include: [{
					model: AdCharacteristicInput,
					attributes: ['value'],
					required: false,
					include: {
						model: Characteristic,
						attributes: ['id', 'name']
					}
				}, {
					model: AdCharacteristicSelect,
					attributes: ['id'],
					required: false,
					include: [{
						model: Characteristic,
						attributes: ['id', 'name']
					}, {
						model: CharacteristicValue,
						attributes: ['id', 'name']
					}]
				}, {
					model: Objects,
					include: [{
						model: CharacteristicObject,
						attributes: ['characteristicId', 'objectId'],
						include: [{
							model: Characteristic,
							include: [{model: CharacteristicValue, attributes: ['id', 'name']}, {
								model: TypeCharacteristic,
								attributes: ['name']
							}],
							attributes: ['name', 'required']
						}]
					}]
				}, {
					model: ImageAd,
					attributes: ['name'],
					required: false
				}, {
					model: PreviewImageAd,
					attributes: ['name'],
					required: false
				}, {
					model: CommercialImageAd,
					attributes: ['name'],
					required: false
				}]
			})
			if (ad === null) {
				return next(ApiError.forbidden('Нет доступа'))
			}
			return res.json(ad)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async editAd(req, res, next) {
		try {
			const userId = req.user
			if (userId === null) {
				return next(ApiError.forbidden('Нет доступа'))
			}
			const {id} = req.params
			let characterInput, characterSelect, ad
			ad = await Ad.findOne({
				where: [{id}, {userId}]
			})
			if (ad === null) {
				return next(ApiError.forbidden('Нет доступа'))
			}
			const {
				title, price, description,
				characteristicsInput, characteristicsSelect
			} = req.body
			const {images} = req.files
			const {previewImage} = req.files
			const {commercialImage} = req.files
			const typeAdId = ad.dataValues.typeAdId

			await Ad.update(
				{ title, description, price }, {
					where: {id}
				})

			await AdCharacteristicInput.destroy({
				where: {adId: id}
			})
			await AdCharacteristicSelect.destroy({
				where: {adId: id}
			})
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
				if (Array.isArray(item.value)) {
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
				} else {
					try {
						characterSelect = await AdCharacteristicSelect.create({
							adId: ad.dataValues.id,
							characteristicId: item.id,
							characteristicValueId: item.value
						})
						await characterSelect.save()
					} catch (e) {
						return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
					}
				}
			})
			if (typeAdId === 2 || typeAdId === 3 || typeAdId === 4) {
				const imagesDB = await CommercialImageAd.findAll({
					where: {adId: id},
					raw: true
				})
				imagesDB.map(async (item) => {
					let fileName = item.name
					const filePath = path.resolve(__dirname, '..', 'static', fileName);
					await fs.unlink(filePath, (err) => {
						if (err) {
							console.error('Ошибка при удалении файла:', err);
						} else {
							console.log('Файл успешно удален');
						}
					});
				})
				await CommercialImageAd.destroy({
					where: {adId: id}
				})
				let previewName = typeAdId === 2 ? 'stPl/' : typeAdId === 3 ? 'vp/' : 'premium/';
				let cardType = typeAdId === 2 ? 'stPl' : typeAdId === 3 ? 'vp' : 'premium';
				previewName = previewName + uuid.v4() + '.webp';
				await resizeImage(commercialImage.data, previewName, cardType)
				await CommercialImageAd.create({adId: ad.id, name: previewName})
			}

			const imagesDB = await ImageAd.findAll({
				where: {adId: id},
				raw: true
			})
			imagesDB.map(async (item) => {
				let fileName = item.name
				const filePath = path.resolve(__dirname, '..', 'static', fileName);
				await fs.unlink(filePath, (err) => {
					if (err) {
						console.error('Ошибка при удалении файла:', err);
					} else {
						console.log('Файл успешно удален');
					}
				});
			})

			const previewImagesDB = await PreviewImageAd.findAll({
				where: {adId: id},
				raw: true
			})
			previewImagesDB.map(async (item) => {
				let fileName = item.name
				const filePath = path.resolve(__dirname, '..', 'static', fileName);
				await fs.unlink(filePath, (err) => {
					if (err) {
						console.error('Ошибка при удалении файла:', err);
					} else {
						console.log('Файл успешно удален');
					}
				});
			})

			await ImageAd.destroy({
				where: {adId: id}
			})
			await PreviewImageAd.destroy({
				where: {adId: id}
			})

			let previewName = 'st/pv/' + uuid.v4() + '.webp'
			await resizeImage(previewImage.data, previewName, 'st')
			await PreviewImageAd.create({adId: ad.id, name: previewName})

			if (images.length === undefined) {
				let fileName = uuid.v4() + '.webp'
				await resizeImage(images.data, fileName, 'card')
				await ImageAd.create({adId: ad.id, name: fileName})
			} else {
				images.map(async (image) => {
					let fileName = uuid.v4() + '.webp'
					await resizeImage(image.data, fileName, 'card')
					await ImageAd.create({adId: ad.id, name: fileName})
				})
			}

			// const previewName = uuid.v4() + '.jpg'
			// try {
			// 	await previewImage.mv(path.resolve(__dirname, '..', 'static', previewName))
			// 	await PreviewImageAd.create({adId: ad.id, name: previewName})
			// } catch (e) {
			// 	console.log(e)
			// }
			//
			// if (images.length === undefined) {
			// 	let fileName = uuid.v4() + '.webp'
			// 	await images.mv(path.resolve(__dirname, '..', 'static', fileName))
			// 	await ImageAd.create({adId: ad.id, name: fileName})
			// } else {
			// 	images.map(async (image) => {
			// 		let fileName = uuid.v4() + '.webp'
			// 		await image.mv(path.resolve(__dirname, '..', 'static', fileName))
			// 		await ImageAd.create({adId: ad.id, name: fileName})
			// 	})
			// }
			return res.json({message: 'Карточка изменена'})
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

}

module.exports = new AdController()
