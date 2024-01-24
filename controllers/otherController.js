const path = require('path');
const {Op, literal} = require('sequelize')
const ApiError = require("../error/ApiError");
const {StaticAd} = require("../models");

class OtherController {
  async sendImage(req, res, next) {
    const {name} = req.params
    res.sendFile(path.join(__dirname, `../asserts/images/${name}`))
  }

  async promotion(req, res, next) {
    try {
      const {limit=2} = req.query
      const currentDate = new Date()
      currentDate.setHours(0,0,0,0)
      const ads = await StaticAd.findAll({
        where: {
          dateStart: {
            [Op.lt]: currentDate
          },
          dateEnd: {
            [Op.gt]: currentDate
          }
        },
        attributes: ['imageName', 'href'],
        order: literal('rand()'),
        limit: parseInt(limit)
      })
      return res.json(ads)
    } catch (e) {
      console.log(e)
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new OtherController()
