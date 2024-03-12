const crypto = require('crypto');
const ApiError = require("../error/ApiError");
const {
    Ad, Booking, TypeAd, PreviewImageAd
} = require('../models');

class PaymentController {
    async payAd(req, res, next) {
        try {
            const userId = req.user
            function fChangeKeyName(pathKey, oldNameKey, newNameKey) {
                pathKey[newNameKey] = pathKey[oldNameKey];
                delete pathKey[oldNameKey];
            }

            let ads = await Booking.findAll({
                where: {userId},
                attributes: ['id', 'cost'],
                include: [{
                    model: Ad,
                    where: {statusAdId: 5},
                    attributes: ['title', 'price'],
                    include: [{
                        model: PreviewImageAd,
                        attributes: ['name']
                    }]
                }, {
                    model: TypeAd,
                    attributes: ['name']
                }],
                raw: true
            })
            for (let i = 0; i < ads.length; i++) {
                fChangeKeyName(ads[i], 'ad.title', 'title')
                fChangeKeyName(ads[i], 'cost', 'OutSum')
                fChangeKeyName(ads[i], 'id', 'InvId')
                fChangeKeyName(ads[i], 'typeAd.name', 'name')
                fChangeKeyName(ads[i], "ad.price", 'price')
                fChangeKeyName(ads[i], "ad.previewImageAds.name", 'previewImage')
                ads[i]['Description'] = `Наименование: "${ads[i]['title']}" \nТип: "${ads[i]['name']}"`
                ads[i]['IsTest'] = 1
                const robokassaLogin = process.env.ROBOKASSA_LOGIN
                const robokassaPassword = process.env.ROBOKASSA_PASSWORD_1
                let crcData = `${robokassaLogin}:${ads[i]['OutSum']}:${ads[i]['InvId']}:${robokassaPassword}`
                ads[i]['crc'] = crypto.createHash('md5').update(crcData).digest("hex");
                delete ads[i]["ad.previewImageAds.id"]
            }
            // https://docs.robokassa.ru/testing-mode/ Документация для тестового
            return res.json(ads)
        } catch (e) {
            console.log(e)
            return next(ApiError.badRequest(e.message))
        }
    }

    async success(req, res, next) {
        try {
            const {OutSum, InvId, SignatureValue} = req.query
            const robokassaPassword = process.env.ROBOKASSA_PASSWORD_1
            let crcData = `${OutSum}:${InvId}:${robokassaPassword}`
            const crc = crypto.createHash('md5').update(crcData).digest("hex");
            if (crc !== SignatureValue) return res.json({message: 'oshibka'})
            await Booking.update({isActive: 1}, {where: {id: InvId}})
            const booking = await Booking.findOne({
                where: {id: InvId},
                raw: true
            })
            await Ad.update({statusAdId: 2}, {where: {id: booking['adId']}})
            return res.redirect(`https://vezdesens.ru/profile/${booking['userId']}#ads`)
        } catch (e) {
            console.log(e.message)
            return next(ApiError.badRequest(e.message))
        }
    }

    async error(req, res, next) {
        try {
            const {InvId} = req.query
            const booking = await Booking.findOne({
                where: {id: InvId},
                raw: true
            })
            return res.redirect(`https://vezdesens.ru/profile/${booking['userId']}#errorPayed`)
        } catch (e) {
            console.log(e.message)
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PaymentController()
