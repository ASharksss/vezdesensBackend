const ApiError = require('../../error/ApiError')
const {Characteristic} = require("../../models");

class CharacteristicController {

  async createCharacteristic(req, res, next) {
    try {
      const {name} = req.body
      const characteristic = await Characteristic.create({name})
      return res.json(characteristic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}

module.exports = new CharacteristicController()