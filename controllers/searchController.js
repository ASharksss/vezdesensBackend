const uuid = require('uuid');
const ApiError = require("../error/ApiError");
const {
    Ad, AdCharacteristicInput, AdCharacteristicSelect,
    Objects, SubCategory, Category,
    PreviewImageAd, Favorite
} = require('../models');
const {Op} = require("sequelize");

class SearchController {
    async search(req, res, next) {
        try {
            const {query, object, subCategory, category, offset = 0} = req.query;
            const userId = req.user;
            let objectIds = [], objectValues = [], price = [0, 1500000000], allAds = null;
            if (query !== undefined) {
                if (query.indexOf(', ') > 0) {
                    query.split(', ').map(item => {
                        const id = item.split('=')[0], value = item.split('=')[1]
                        if (id !== 'price') {
                            objectIds.push(parseInt(id))
                            objectValues.push(value.indexOf('-') === 1 ? value : JSON.parse(value))
                        } else {
                            price = value.split('-').map(Number)
                        }
                    })
                } else {
                    const id = query.split('=')[0], value = query.split('=')[1]
                    if (id !== 'price') {
                        objectIds.push(parseInt(id))
                        objectValues.push(value.indexOf('-') === 1 ? value : JSON.parse(value))
                    } else {
                        price = value.split('-').map(Number)
                    }
                }
            }
            let selectsArray = [], inputsArray = []
            for (let i = 0; i < objectIds.length; i++) {
                let id = objectIds[i], value = objectValues[i]
                if (Array.isArray(value)) {
                    selectsArray.push({
                        characteristicId: id,
                        characteristicValueId: {[Op.in]: value}
                    })
                } else if (typeof value === 'string') {
                    inputsArray.push({
                        characteristicId: id,
                        value: value.indexOf('-') > 0 ? {[Op.between]: value.split('-').map(Number)} : value
                    })
                } else {
                    selectsArray.push({
                        characteristicId: id,
                        characteristicValueId: value
                    })
                }
            }
            let selectInclude = {
                model: AdCharacteristicSelect,
                attributes: []
            }, inputsInclude = {
                model: AdCharacteristicInput,
                attributes: []
            }
            if (selectsArray.length > 0) {
                selectInclude.where = {[Op.or]: selectsArray}
            }
            if (inputsArray.length > 0) {
                inputsInclude.where = {[Op.or]: inputsArray}
            }
            if (object !== undefined) {
                allAds = await SubCategory.findAll({
                    attributes: ['id', 'name'],
                    where: {id: subCategory},
                    include: [{
                        model: Category,
                        attributes: ['id', 'name'],
                        where: {id: category}
                    }, {
                        model: Objects,
                        attributes: ['id', 'name'],
                        where: {id: object},
                        include: {
                            model: Ad,
                            where: {
                                price: {[Op.between]: price},
                                statusAdId: {[Op.or]: [2, 4]}
                            },
                            attributes: ['id', 'title', 'price', 'description', 'address', 'views', 'showPhone', 'createdAt', 'typeAdId'],
                            include: [selectInclude, inputsInclude, {
                                model: PreviewImageAd,
                                attributes: ['name']
                            }, {
                                model: Favorite,
                                where: {userId},
                                required: false
                            }]
                        }
                    }],
                    limit: 16,
                    offset: parseInt(offset)
                })
            } else {
                allAds = await SubCategory.findAll({
                    attributes: ['id', 'name'],
                    where: {id: subCategory},
                    include: [{
                        model: Category,
                        attributes: ['id', 'name'],
                        where: {id: category}
                    }, {
                        model: Objects,
                        attributes: ['id', 'name'],
                        include: {
                            model: Ad,
                            where: {
                                price: {[Op.between]: price},
                                statusAdId: {[Op.or]: [2, 4]}
                            },
                            attributes: ['id', 'title', 'price', 'description', 'address', 'views', 'showPhone', 'createdAt', 'typeAdId'],
                            include: [selectInclude, inputsInclude, {
                                model: PreviewImageAd,
                                attributes: ['name']
                            }, {
                                model: Favorite,
                                where: {userId},
                                required: false
                            }]
                        }
                    }],
                    limit: 16,
                    offset: parseInt(offset)
                })
            }
            let newArray = []
            if (userId === null) {
                if (allAds.length > 0)
                    newArray = allAds[0].dataValues.objects.flatMap(object =>
                        object.dataValues.ads.map(item => {
                            const {favorites, ...rest} = item.dataValues;
                            return rest;
                        })
                    );
            }
            if (userId !== null) {
                if (allAds.length > 0)
                    newArray = allAds[0].dataValues.objects.flatMap(object =>
                        object.dataValues.ads.map(item => ({
                            ...item.dataValues,
                            favorites: item.dataValues.favorites.length > 0
                        }))
                    );
            }

            return res.json({ads: newArray, offset: newArray.length})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
        }
    }
}

module.exports = new SearchController()
