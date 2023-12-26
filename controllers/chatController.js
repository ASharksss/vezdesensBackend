const {QueryTypes, Op} = require("sequelize");
const ApiError = require('../error/ApiError')
const {chatDB} = require('../db')
const {MessageChat, Chat, Ad, User, StatusAd, PreviewImageAd, ImageAd} = require("../models");

class chatController {

  async getDialogues(req, res, next) {
    try {
      const {userId} = req.query
      const dialogues = Chat.findAll({
        where: userId
      })
      return res.json(dialogues)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async addDialogues(req, res, next) {
    try {
      const {adId} = req.body
      const dialogue = await Chat.create({adId: adId})
      return res.json(dialogue)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async addMessage(req, res, next) {
    try {
      const {messageText, userId} = req.body
      const message = await MessageChat.create({text: messageText, userId})
      return res.json(message)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getMessages(req, res, next) {
    try {
			const userId = req.user
			let adsResult = []
			const [data,] = await chatDB.query(
				`SELECT chats.id as id, chats.adId as adId,
							users.senderId as senderId, last_message.lastMessage
							FROM vezdesens_chat.chats as chats
							INNER JOIN vezdesens_chat.chat_users as users
							ON users.chatId = chats.id
							LEFT OUTER JOIN (
									SELECT chatId, MAX(createdAt) as lastMessage
									FROM vezdesens_chat.messages
									GROUP BY chatId
							) as last_message
							ON last_message.chatId = chats.id
							WHERE chats.sellerId = ${userId} OR users.senderId = ${userId}
							order by lastMessage desc`)
			const adIds = data.map(item => {
				return {
					[item.adId]: [item.senderId, item.lastMessage, item.id]
				}
			})
			for (const obj of adIds) {
				let key = parseInt(Object.keys(obj)[0]);
				let value = parseInt(obj[key][0]);
				let lastMessage = obj[key][1]
				let chatId = obj[key][2]

				const ads = await Ad.findOne({
					where: {id: key},
					attributes: ['id', 'title', 'price'],
					include: [{
						model: User,
						attributes: ['id', 'name']
					}, {
						model: StatusAd,
						attributes: ['name']
					}, {
						model: PreviewImageAd,
						attributes: ['name'],
						required: false
					}]
				})
				const user = await User.findOne({
					where: {id: value},
					attributes: ['id', 'name']
				})
				ads.dataValues['lastMessage'] = lastMessage
				ads.dataValues['chat'] = chatId
				adsResult.push([ads, user])
			}
      return res.json(adsResult)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new chatController()