const ApiError = require('../error/ApiError')
const {
	Ad, Objects,
	SubCategory, Category,
	TypeAd, User, Booking,
	Favorite, ImageAd
} = require('../models')
const {Op, literal} = require("sequelize");
const {decryptArrayWithKey} = require("../utils");


class BoardController {

	async getAll(req, res, next) {
		try {
			const {subCategoryId, objectId, offset = "0|0|0", key} = req.query
			let ads, allAds, bookings,
				blockOffset = parseInt(offset.split('|')[0]),
				commercialOffset = parseInt(offset.split('|')[1]),
				vipOffset = parseInt(offset.split('|')[2])
			const currentDate = new Date()
			const userId = req.user
			allAds = await Ad.findAll()
			bookings = await Booking.findAll()

			//Перебор всех объявлений
			for (let i = 0; i < allAds.length; i++) {
				//Проверка на просроченные объявления
				if (allAds[i].dateEndActive < currentDate) {
					allAds[i].statusAdId = 3
					await allAds[i].save()
				}
				//Перебор всех бронирований
				for (let i = 0; i < bookings.length; i++) {
					//Проверка на дату бронирования
					if (bookings[i].dateEnd < currentDate) {
						bookings[i].isActive = 0
						allAds[i].typeAdId = 1
						allAds[i].save()
						bookings[i].save()
					}
				}
			}

			//Проверка на категорию
			if (!subCategoryId && !objectId) {
				ads = await Ad.findAll({
					where: {
						[Op.or]: [{statusAdId: 1}, {statusAdId: 2}],
						typeAdId: 1
					},
					include: [{
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
					}, {
						model: ImageAd,
						required: false
					}],
					limit: 15,
					offset: blockOffset
				})
				const adsVip = await Ad.findAll({
					where: {
						typeAdId: 3,
						[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]
					},
					include: [{
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
					}, {
						model: ImageAd,
						required: false
					}],
					limit: 2,
					offset: vipOffset
				})
				let adsCommercialLimit = 4
				if (adsVip.length < 2)
					if (adsVip.length === 0)
						adsCommercialLimit += 2
					else
						adsCommercialLimit += 1
				const adsCommercial = await Ad.findAll({
					where: {
						typeAdId: 2,
						[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]
					},
					include: [{
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
					}, {
						model: ImageAd,
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
			}

			if (subCategoryId && !objectId) {
				ads = await Ad.findAll({
					include: [{
						model: Objects,
						where: [
							{subCategoryId: subCategoryId},
							{[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]}
						],
						include: [{
							model: SubCategory,
							include: Category
						}]
					},
						{model: TypeAd},
						{model: User},
						{
							model: Favorite,
							where: {userId},
							required: false
						}],
					limit: 15,
					offset: parseInt(offset)
				})
			}

			if (!subCategoryId && objectId) {
				let ignoreIds = []
				if (key !== undefined) {
					ignoreIds = decryptArrayWithKey(key)
					console.log(ignoreIds)
				}
				ads = await Ad.findAll({
					where: [
						{objectId: objectId},
						{id: {[Op.notIn]: ignoreIds}},
						{typeAdId: 1},
						{[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]}
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
						}, {
							model: ImageAd,
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
			const ads = await Ad.findAll({
				where: [{statusAdId: 2}, {typeAdId: 4}],
				include: [{
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
					model: ImageAd,
					required: false
				}],
			})
			return res.json({ads})
		} catch (e) {
			console.log(e)
			return next(ApiError.badRequest(e.message))
		}
	}


}

module.exports = new BoardController()
