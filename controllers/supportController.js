const ApiError = require("../error/ApiError");
const {TopicOfAppeal, StatusOfAppeal, Appeal, Message, ResponseSupport} = require("../models");

class SupportController {
  async createTopicAppeals(req, res, next) {
    try {
      const {name} = req.body
      const topic = await TopicOfAppeal.create({
       name
      })
      return res.json(topic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createStatusAppeals(req, res, next) {
    try {
      const {name} = req.body
      const status = await StatusOfAppeal.findOrCreate({
        where: {name}
      })
      return res.json(status)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createAppeal(req, res, next) {
    try {
      const {topicOfAppealId, statusOfAppealId, userId} = req.body
      const appeal = await Appeal.create({
        topicOfAppealId,
        statusOfAppealId,
        userId
      })
      return res.json(appeal)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createMessage(req, res, next) {
    try {
      const {appealId, text} = req.body
      const message = await Message.create({
        appealId,
        text
      })
      return res.json(message)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createResponseSupport(req, res, next) {
    try {
      const {appealId, text} = req.body
      const response = await ResponseSupport.create({
        appealId,
        text
      })
      return res.json(response)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getAllAppeal(req, res, next) {
    try {
      const appeal = await Appeal.findAll()
      return res.json(appeal)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getTopicAppeals(req, res, next) {
    try {
      const topic = await TopicOfAppeal.findAll()
      return res.json(topic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

}

module.exports = new SupportController()