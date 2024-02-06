const uuid = require('uuid');
const ApiError = require("../error/ApiError");
const {
    Ad, AdCharacteristicInput, AdCharacteristicSelect,
    Objects, SubCategory, Category, PreviewImageAd
} = require('../models');
const {Op} = require("sequelize");

class SearchController {
    async search(req, res, next) {
        try {
            const {query, object, subCategory, category, offset=0} = req.query
            let objectIds = [], objectValues = [], price= [0, 1500000000], ads = null
            if (query !== undefined)
                query.indexOf(', ') > 0 ? query.split(', ') : [query].map(item => {
                    const id = item.split('=')[0], value = item.split('=')[1]
                    if (id !== 'price') {
                        objectIds.push(parseInt(id))
                        objectValues.push(value.indexOf('-') === 1 ? value : JSON.parse(value))
                    } else {
                        price = value.split('-').map(Number)
                    }
                })
            let selectsArray = [], inputsArray = []
            for (let i=0; i < objectIds.length; i++) {
                let id = objectIds[i], value = objectValues[i]
                if (Array.isArray(value)){
                    selectsArray.push({
                        characteristicId: id,
                        characteristicValueId: {[Op.in]: value}
                    })
                } else if(typeof value === 'string') {
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
            if (object !== undefined){
                ads = await SubCategory.findAll({
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
                                statusAdId: {[Op.or]: [2,4]}
                            },
                            attributes: ['id', 'title', 'price', 'description', 'address', 'views', 'showPhone', 'createdAt', 'typeAdId'],
                            include: [selectInclude, inputsInclude, {
                                model: PreviewImageAd,
                                attributes: ['name']
                            }]
                        }
                    }],
                    limit: 16,
                    offset: parseInt(offset)
                })
            } else {
                ads = await SubCategory.findAll({
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
                                statusAdId: {[Op.or]: [2,4]}
                            },
                            attributes: ['id', 'title', 'price', 'description', 'address', 'views', 'showPhone', 'createdAt', 'typeAdId'],
                            include: [selectInclude, inputsInclude, {
                                model: PreviewImageAd,
                                attributes: ['name']
                            }]
                        }
                    }],
                    limit: 16,
                    offset: parseInt(offset)
                })
            }
            return res.json({ads, offset: ads.length})
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest("Ошибка обработки со стороны сервера"))
        }
    }
}

module.exports = new SearchController()
