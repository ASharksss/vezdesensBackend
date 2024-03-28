const crypto = require('crypto');
const {Op} = require('sequelize');
const ApiError = require("../error/ApiError");
const {
    Ad, Booking, TypeAd, PreviewImageAd, User
} = require('../models');
const {postData, receipt} = require("../utils");

class PaymentController {
    async payAd(req, res, next) {
        try {
            const userId = req.user

            function fChangeKeyName(pathKey, oldNameKey, newNameKey) {
                pathKey[newNameKey] = pathKey[oldNameKey];
                delete pathKey[oldNameKey];
            }

            const currentDate = new Date().setHours(15, 0, 0, 0)
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
            let ads = await Booking.findAll({
                where: {userId},
                attributes: ['id', 'cost'],
                include: [{
                    model: Ad,
                    where: {
                        [Op.or]: [
                            {statusAdId: 3},
                            {statusAdId: 5}
                        ]
                    },
                    attributes: ['id', 'title'],
                    include: [{
                        model: PreviewImageAd,
                        attributes: ['name']
                    }]
                }, {
                    model: TypeAd,
                    attributes: ['name']
                }, {
                    model: User,
                    attributes: ['email']
                }],
                raw: true
            })
            const robokassaLogin = process.env.ROBOKASSA_LOGIN
            const robokassIsTest = process.env.ROBOKASSA_IS_TEST || 1
            const robokassaPassword = process.env.ROBOKASSA_PASSWORD_1
            for (let i = 0; i < ads.length; i++) {
                fChangeKeyName(ads[i], 'ad.title', 'title')
                fChangeKeyName(ads[i], 'cost', 'OutSum')
                fChangeKeyName(ads[i], 'id', 'InvId')
                fChangeKeyName(ads[i], 'typeAd.name', 'name')
                fChangeKeyName(ads[i], "ad.id", 'adId')
                fChangeKeyName(ads[i], "user.email", 'email')
                fChangeKeyName(ads[i], "ad.previewImageAds.name", 'previewImage')
                const receiptData = receipt(ads[i]['name'], ads[i]['OutSum'])
                const receiptURLEncode = encodeURIComponent(JSON.stringify(receiptData)).replace(/%3A/g, ":" ).replace(/%2C/g,",")
                let crcData = `${robokassaLogin}:${ads[i]['OutSum']}:${ads[i]['InvId']}:${receiptURLEncode}:${robokassaPassword}`
                const crc = crypto.createHash('md5').update(crcData).digest("hex");
                const invoice = await postData(robokassaLogin, ads[i]['OutSum'], ads[i]['InvId'], receiptURLEncode, crc, ads[i]['email'], robokassIsTest)
                    .then(async data => {
                        console.warn(`ad ${ads[i]['InvId']}`, data)
                        return data?.invoiceID;
                    })
                    .catch(error => {
                        console.error('Ошибка при выполнении запроса:', error);
                    });
                ads[i]['paymentHref'] = `https://auth.robokassa.ru/Merchant/Index/${invoice}`
                delete ads[i]["ad.previewImageAds.id"]
                delete ads[i]["InvId"]
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
            const booking = await Booking.findOne({
                where: {id: InvId},
                include: {
                    model: TypeAd,
                    attributes: ['name']
                },
                raw: true
            })
            if (!booking) return res.json({message: 'oshibka, ne nashel zakaz'});
            let crcData = `${OutSum}:${InvId}:${robokassaPassword}`
            const crc = crypto.createHash('md5').update(crcData).digest("hex");
            if (crc !== SignatureValue) return res.json({message: 'oshibka'})
            await Booking.update({isActive: 1}, {where: {id: InvId}})
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
