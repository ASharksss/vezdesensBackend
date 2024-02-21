const ApiError = require("../error/ApiError");
const {
  TopicOfAppeal, StatusOfAppeal, Appeal, Message
} = require("../models");

class SupportController {
  async createTopicAppeals(req, res, next) {
    try {
      const {name} = req.body
      const topic = await TopicOfAppeal.create({ name })
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
      const {topicOfAppealId, userId, text} = req.body
      const appeal = await Appeal.create({
        topicOfAppealId,
        statusOfAppealId: 1,
        userId
      })
      await Message.create({
        appealId: appeal.dataValues.id,
        text,
        messageId: null,
        isSupport: false
      })
      return res.json(appeal)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async closeAppeal(req, res, next) {
    try {
      const {appealId} = req.body
      const appeal = await Appeal.update(
        {statusOfAppealId: 2},
        {where: {id: appealId}}
      )
      return res.json(appeal)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createMessage(req, res, next) {
    try {
      const {appealId, text, messageId = null, isSupport = false} = req.body
      const message = await Message.create({
        appealId,
        text,
        messageId,
        isSupport
      })
      return res.json(message)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getAllAppeal(req, res, next) {
    try {
      const {statusOfAppealId} = req.query
      let appeal = await Appeal.findAll({
        include: [{model: StatusOfAppeal}, {model: TopicOfAppeal}]
      })

      if (statusOfAppealId) {
        appeal = await Appeal.findAll({
          where: {statusOfAppealId},
          include: [{model: StatusOfAppeal}, {model: TopicOfAppeal}]
        })
      }


      return res.json(appeal)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getMessagesOfAppeal(req, res, next) {
    try {
      const {id} = req.query
      const messages = await Message.findAll({
        where: {appealId: id},
        include: [{model: Appeal, include: {model: TopicOfAppeal}}, {model: Message, required: false}]
      })
      return res.json(messages)
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
