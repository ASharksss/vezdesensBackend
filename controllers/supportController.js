const ApiError = require("../error/ApiError");
const {
  TopicOfAppeal, StatusOfAppeal, Appeal, Message, User
} = require("../models");

class SupportController {
  async createTopicAppeals(req, res, next) {
    try {
      const {name} = req.body
      const topic = await TopicOfAppeal.create({name})
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
        parentId: null,
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
      await Appeal.update(
        {statusOfAppealId: 1},
        {where: {id: appealId}}
      )
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
			const userId = req.user
      const {statusOfAppealId} = req.query
      let appeal = await Appeal.findAll({
				where: {userId},
        include: [{model: StatusOfAppeal}, {model: TopicOfAppeal}],
				order: [['createdAt', 'DESC']]
      })

      if (statusOfAppealId) {
        appeal = await Appeal.findAll({
          where: {statusOfAppealId, userId},
          include: [{model: StatusOfAppeal}, {model: TopicOfAppeal}],
					order: [['createdAt', 'DESC']]
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
        include: [{model: Appeal,
          include: [{model: TopicOfAppeal}, {model: User, required: false, attributes: ['name']}]
        }, {
          model: Message,
          required: false
        }]
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
