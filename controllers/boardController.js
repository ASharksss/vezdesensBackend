const ApiError = require('../error/ApiError')
const {
	Ad, Objects,
	SubCategory, Category,
	TypeAd, User, Booking,
	Favorite, ImageAd, CharacteristicObject,
	AdCharacteristicInput, PreviewImageAd, CommercialImageAd
} = require('../models')
const {Op, literal} = require("sequelize");
const {decryptArrayWithKey} = require("../utils");


class BoardController {

	async getAll(req, res, next) {
		try {
			const {subCategoryId, objectId, offset = "0|0|0", key, query} = req.query
			let ads = [], allAds, bookings,
				blockOffset = parseInt(offset.split('|')[0]),
				commercialOffset = parseInt(offset.split('|')[1]),
				vipOffset = parseInt(offset.split('|')[2])
			const userId = req.user
			const currentDate = new Date()
			currentDate.setHours(0, 0, 0, 0)
			allAds = await Ad.findAll()
			bookings = await Booking.findAll()
			console.log('Position', req.position)

			//Перебор всех объявлений
			for (const ad of allAds) {
				//Проверка на просроченные объявления
				if (new Date(ad.dateEndActive) < currentDate) {
					ad.statusAdId = 3
					await ad.save()
				}
				//Перебор всех бронирований
				for (const booking of bookings) {
					//Проверка на дату бронирования
					if (new Date(booking.dateEnd) < currentDate && booking.isActive === true) {
						booking.isActive = 0
						ad.typeAdId = 1
						await ad.save()
						await booking.save()
					}
				}
			}
			const includeArray = [
				{
					model: Objects,
					where: [ { subCategoryId: subCategoryId } ],
					include: [ {
							model: SubCategory,
							include: Category
						}]
				}, {
					model: TypeAd,
				}, {
					model: User,
					attributes: ['id', 'login', 'createdAt', 'phone', 'name']
				}, {
					model: PreviewImageAd,
					required: false
				}
			]

			if (userId !== null) {
				includeArray.push({
					model: Favorite,
					where: { userId },
					required: false
				})
			}

			if(query) { // для фильтров
				const decryptHash = decryptArrayWithKey(query)
				const charactericticsIds = [], characteristicsValuesIds = []
				let price = [0, 1500000000], characteristicsValuesEnter = [0, 1500000000]
				decryptHash[0].map(objects => {
					charactericticsIds.push(objects.id)
					objects.value.map(item => {
						characteristicsValuesIds.push(item)
					})
				})
				decryptHash[1].map(objects => {
					if(objects.id === 'цена'){
						price = objects.value.split('-').map(Number)
					} else {
						charactericticsIds.push(objects.id)
						characteristicsValuesEnter = objects.value.split('-').map(Number)
					}
				})
				const filterAds = await CharacteristicObject.findAll({
					where: charactericticsIds.length > 0 ? {characteristicId: {[Op.in]: charactericticsIds}} : {},
					include: [{
						model: Objects,
						include: [{
							model: Ad,
							where: {
								statusAdId: 2,
								price: {[Op.between]: price}
							},
							include: [{
								model: AdCharacteristicInput,
								where: {value: {[Op.between]: characteristicsValuesEnter}}
							}, {
								model: Objects,
								include: [{
									model: SubCategory,
									include: Category
								}]
							}, {
								model: TypeAd
							}, {
								model: User,
								attributes: ['id', 'login', 'email', 'phone', 'createdAt']
							}, {
								model: PreviewImageAd,
								required: false
							}],
						}]
					}],
					limit: 10,
					offset: blockOffset
				})
				filterAds.map(objects => {
					ads.push(...objects.dataValues.object.dataValues.ads)
				})
				return res.json({ads, blockOffset})

			}

			//Проверка на категорию
			if (!subCategoryId && !objectId) {
				ads = await Ad.findAll({
					where: {
						statusAdId: 2,
						typeAdId: 1
					},
					include: [{
						model: TypeAd,
					}, {
						model: User,
						attributes: ['id', 'login', 'createdAt', 'phone', 'name']
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: PreviewImageAd,
						required: false
					}],
					order: [['createdAt', 'DESC']],
					limit: 10,
					offset: blockOffset
				})
				const adsVip = await Ad.findAll({
					where: {
						typeAdId: 3,
						statusAdId: 2
					},
					include: [{
						model: TypeAd,
					}, {
						model: User,
						attributes: ['id', 'login', 'createdAt', 'phone', 'name']
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: CommercialImageAd,
						required: false
					}],
					limit: 1,
					offset: vipOffset
				})
				let adsCommercialLimit = 4
				if (adsVip.length === 1)
					adsCommercialLimit = 2;
				const adsCommercial = await Ad.findAll({
					where: {
						typeAdId: 2,
						statusAdId: 2
					},
					include: [{
						model: TypeAd,
					}, {
						model: User,
						attributes: ['id', 'login', 'createdAt', 'phone', 'name']
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: CommercialImageAd,
						required: false
					}],
					limit: adsCommercialLimit,
					offset: commercialOffset
				})
				// console.log(ads)
				blockOffset += ads.length
				commercialOffset += adsCommercial.length
				vipOffset += adsVip.length
				ads.push(...adsCommercial)
				ads.push(...adsVip)
				console.log(ads.length)
			}

			if (subCategoryId && !objectId) {
				let ignoreIds = []
				if (key !== undefined) {
					ignoreIds = decryptArrayWithKey(key)
				}
				ads = await Ad.findAll({
					where: [
						{id: {[Op.notIn]: ignoreIds}},
						{statusAdId: 2}
					],
					include: includeArray,
					order: literal('rand()'),
					limit: 20,
					offset: parseInt(offset)
				})
			}

			if (!subCategoryId && objectId) {
				let ignoreIds = []
				if (key !== undefined) {
					ignoreIds = decryptArrayWithKey(key)
				}
				ads = await Ad.findAll({
					where: [
						{objectId: objectId},
						{id: {[Op.notIn]: ignoreIds}},
						{typeAdId: 1},
						{statusAdId: 2}
					],
					include: [{
							model: TypeAd
						}, {
							model: User,
							attributes: ['id', 'login', 'createdAt', 'phone', 'name']
						}, {
							model: Favorite,
							where: {userId},
							required: false
						}	, {
							model: PreviewImageAd,
							required: false
						}],
					order: literal('rand()'),
					limit: 20,
					offset: parseInt(offset)
				})
				blockOffset += ads.length
			}
			return res.json({ads, blockOffset, commercialOffset, vipOffset})
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}

	async getAllMobile(req, res, next) {
		try {
			const {subCategoryId, objectId, offset = "0|0|0", key, query} = req.query
			let ads = [], allAds, bookings,
				blockOffset = parseInt(offset.split('|')[0]),
				commercialOffset = parseInt(offset.split('|')[1]),
				vipOffset = parseInt(offset.split('|')[2])
			const userId = req.user
			const currentDate = new Date()
			currentDate.setHours(0, 0, 0, 0)
			allAds = await Ad.findAll()
			bookings = await Booking.findAll()

			//Перебор всех объявлений
			for (const ad of allAds) {
				//Проверка на просроченные объявления
				if (new Date(ad.dateEndActive) < currentDate) {
					ad.statusAdId = 3
					await ad.save()
				}
				//Перебор всех бронирований
				for (const booking of bookings) {
					//Проверка на дату бронирования
					if (new Date(booking.dateEnd) < currentDate && booking.isActive === true) {
						booking.isActive = 0
						ad.typeAdId = 1
						await ad.save()
						await booking.save()
					}
				}
			}
			const includeArray = [
				{
					model: Objects,
					where: [ { subCategoryId: subCategoryId } ],
					include: [ {
						model: SubCategory,
						include: Category
					}]
				}, {
					model: TypeAd
				}, {
					model: User,
					attributes: ['id', 'login', 'createdAt', 'phone', 'name']
				}, {
					model: PreviewImageAd,
					required: false
				}
			]

			if (userId !== null) {
				includeArray.push({
					model: Favorite,
					where: { userId },
					required: false
				})
			}

			if(query) { // для фильтров
				const decryptHash = decryptArrayWithKey(query)
				const charactericticsIds = [], characteristicsValuesIds = []
				let price = [0, 1500000000], characteristicsValuesEnter = [0, 1500000000]
				decryptHash[0].map(objects => {
					charactericticsIds.push(objects.id)
					objects.value.map(item => {
						characteristicsValuesIds.push(item)
					})
				})
				decryptHash[1].map(objects => {
					if(objects.id === 'цена'){
						price = objects.value.split('-').map(Number)
					} else {
						charactericticsIds.push(objects.id)
						characteristicsValuesEnter = objects.value.split('-').map(Number)
					}
				})
				const filterAds = await CharacteristicObject.findAll({
					where: charactericticsIds.length > 0 ? {characteristicId: {[Op.in]: charactericticsIds}} : {},
					include: [{
						model: Objects,
						include: [{
							model: Ad,
							where: {
								statusAdId: 2,
								price: {[Op.between]: price}
							},
							include: [{
								model: AdCharacteristicInput,
								where: {value: {[Op.between]: characteristicsValuesEnter}}
							}, {
								model: Objects,
								include: [{
									model: SubCategory,
									include: Category
								}]
							}, {
								model: TypeAd
							}, {
								model: User,
								attributes: ['id', 'login', 'email', 'phone', 'createdAt']
							}, {
								model: PreviewImageAd,
								required: false
							}],
						}]
					}],
					limit: 6,
					offset: blockOffset
				})
				filterAds.map(objects => {
					ads.push(...objects.dataValues.object.dataValues.ads)
				})
				return res.json({ads, blockOffset})

			}

			//Проверка на категорию
			if (!subCategoryId && !objectId) {
				ads = await Ad.findAll({
					where: {
						statusAdId: 2,
						typeAdId: 1
					},
					include: [{
						model: TypeAd
					}, {
						model: User
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: PreviewImageAd,
						required: false
					}],
					order: [['createdAt', 'DESC']],
					limit: 6,
					offset: blockOffset
				})
				const adsVip = await Ad.findAll({
					where: {
						typeAdId: 3,
						statusAdId: 2
					},
					include: [{
						model: TypeAd
					}, {
						model: User
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: CommercialImageAd,
						required: false
					}],
					limit: 1,
					offset: vipOffset
				})
				const adsCommercial = await Ad.findAll({
					where: {
						typeAdId: 2,
						statusAdId: 2
					},
					include: [{
						model: TypeAd
					}, {
						model: User
					}, {
						model: Favorite,
						where: {userId},
						required: false
					}, {
						model: CommercialImageAd,
						required: false
					}],
					limit: 2,
					offset: commercialOffset
				})
				// console.log(ads)
				blockOffset += ads.length
				commercialOffset += adsCommercial.length
				vipOffset += adsVip.length
				ads.push(...adsCommercial)
				ads.push(...adsVip)
				console.log(ads.length)
			}

			if (subCategoryId && !objectId) {
				let ignoreIds = []
				if (key !== undefined) {
					ignoreIds = decryptArrayWithKey(key)
				}
				ads = await Ad.findAll({
					where: [
						{id: {[Op.notIn]: ignoreIds}},
						{statusAdId: 2}
					],
					include: includeArray,
					order: literal('rand()'),
					limit: 20,
					offset: parseInt(offset)
				})
			}

			if (!subCategoryId && objectId) {
				let ignoreIds = []
				if (key !== undefined) {
					ignoreIds = decryptArrayWithKey(key)
				}
				ads = await Ad.findAll({
					where: [
						{objectId: objectId},
						{id: {[Op.notIn]: ignoreIds}},
						{typeAdId: 1},
						{statusAdId: 2}
					],
					include: [
						{
							model: Objects,
							include: [{
								model: SubCategory,
								include: Category
							}]
						}, {
							model: TypeAd
						}, {
							model: User
						}, {
							model: Favorite,
							where: {userId},
							required: false
						}	, {
							model: PreviewImageAd,
							required: false
						}],
					order: literal('rand()'),
					limit: 20,
					offset: parseInt(offset)
				})
				blockOffset += ads.length
			}
			return res.json({ads, blockOffset, commercialOffset, vipOffset})
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}

	async getPremium(req, res, next) {
		try {
			const booking = await Booking.findAll({
				where: [{isActive: true}],
				include: {
					model: Ad,
					where: {statusAdId: 2, typeAdId: 4},
					include: [{
						model: TypeAd
					}, {
						model: User,
						attributes: ['login', 'phone', 'createdAt', 'email']
					}, {
						model: ImageAd,
						required: false
					}, {
						model: CommercialImageAd,
						required: false
					}],
				},
				order: [['position', 'DESC']]
			})
			const ads = booking.map(item => item.dataValues.ad)
			return res.json(ads)
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}


}

module.exports = new BoardController()
