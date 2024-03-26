const crypto = require('crypto');
const {Op} = require('sequelize');
const ApiError = require("../error/ApiError");
const {
    Ad, Booking, TypeAd, PreviewImageAd
} = require('../models');

class PaymentController {

    receipt = (name, sum) => ({
        "sno": "usn_income_outcome",				                // usn_income_outcome - Упрощенная СН (доходы минус расходы)
        "items": [
            {
                "name": `Продвижение, услуга ${name}`,	// Наименование товара/услуг
                "quantity": 1,						                // Количество
                "sum": `${parseInt(sum)}`,				// Общая стоимость (cost*quantity)=sum
                "payment_method": "full_payment", 	                // full_payment - полный расчёт
                "payment_object": "service",			            // service - услуга
                "tax": "none"							            // без ндс
            }
        ]
    })

    async payAd(req, res, next) {
        try {
            const userId = req.user
            function fChangeKeyName(pathKey, oldNameKey, newNameKey) {
                pathKey[newNameKey] = pathKey[oldNameKey];
                delete pathKey[oldNameKey];
            }
            const currentDate = new Date().setHours(15,0,0,0)
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
                if (new Date(bookings[i]['dateStart']) <= currentDate && new Date(bookings[i]['dateEnd']) > currentDate){
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
                }],
                raw: true
            })
            for (let i = 0; i < ads.length; i++) {
                fChangeKeyName(ads[i], 'ad.title', 'title')
                fChangeKeyName(ads[i], 'cost', 'OutSum')
                fChangeKeyName(ads[i], 'id', 'InvId')
                fChangeKeyName(ads[i], 'typeAd.name', 'name')
                fChangeKeyName(ads[i], "ad.id", 'adId')
                fChangeKeyName(ads[i], "ad.previewImageAds.name", 'previewImage')
                const receiptURLEncode = encodeURIComponent(JSON.stringify(this.receipt(ads[i]['name'], ads[i]['OutSum'])))
                const payment_description = `Наименование: "${ads[i]['title']}" \nТип: "${ads[i]['name']}"`
                const robokassaLogin = process.env.ROBOKASSA_LOGIN
                const robokassaPassword = process.env.ROBOKASSA_PASSWORD_1
                let crcData = `${robokassaLogin}:${ads[i]['OutSum']}:${ads[i]['InvId']}:${receiptURLEncode}:${robokassaPassword}`
                const crc = crypto.createHash('md5').update(crcData).digest("hex");
                ads[i]['paymentHref'] = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=vezdesens&OutSum=${ads[i]['OutSum']}&InvoiceID=${ads[i]['InvId']}&Description=${payment_description}&SignatureValue=${crc}&IsTest=1`
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
            if (!booking) return res.json({message: 'oshibka'});
            const receiptURLEncode = encodeURIComponent(JSON.stringify(this.receipt(booking['typeAd.name'], booking['cost'])))
            let crcData = `${OutSum}:${InvId}:${receiptURLEncode}:${robokassaPassword}`
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
