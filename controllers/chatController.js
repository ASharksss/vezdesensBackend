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

	async getCheckNewMessages(req, res, next) {
		try {
			const userId = req.user
			const [ids,] = await chatDB.query(
				`SELECT chats.id as id
						FROM chats as chats
						inner join chat_users as users on users.chatId = chats.id
						where users.senderId = ${userId} or users.receiverId = ${userId}
						GROUP BY chats.id`
			)
			const [data,] = await chatDB.query(
				`SELECT count(*) as count FROM messages where receiverRead=0 and senderId != ${userId} and chatId in (${ids.map(item => item.id).toString()});`)
			return res.json(data[0])
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

  async getMessages(req, res, next) {
    try {
			const userId = req.user
			let adsResult = []
			const [data,] = await chatDB.query(
				`SELECT
								ranked_messages.id,
								ranked_messages.adId,
								ranked_messages.senderId,
								ranked_messages.lastMessage,
								ranked_messages.unreadCount
						FROM (
								SELECT
										chats.id as id,
										chats.adId as adId,
										users.senderId as senderId,
										messages.createdAt as lastMessage,
										COUNT(unreadMessages.id) as unreadCount,
										(SELECT COUNT(*)
										 FROM messages as m
										 WHERE m.chatId = messages.chatId AND m.createdAt > messages.createdAt) + 1 as row_num
								FROM chats as chats
								INNER JOIN chat_users as users ON users.chatId = chats.id
								LEFT OUTER JOIN messages as messages ON messages.chatId = chats.id
								LEFT OUTER JOIN messages as unreadMessages ON unreadMessages.chatId = chats.id
										AND unreadMessages.receiverRead = 0 AND unreadMessages.senderId != ${userId}
								WHERE chats.sellerId = ${userId} OR users.senderId = ${userId}
								GROUP BY chats.id, chats.adId, users.senderId, messages.createdAt
						) as ranked_messages
						WHERE ranked_messages.row_num = 1
						ORDER BY ranked_messages.lastMessage DESC;`)
			const newData = data.reduce((o, i) => {
				if (!o.find(v => v.id === i.id)) {
					o.push(i);
				}
				return o;
			}, []);
			const adIds = newData.map(item => {
				return {
					[item.adId]: [item.senderId, item.lastMessage, item.id, item.unreadCount]
				}
			})
			for (const obj of adIds) {
				let key = parseInt(Object.keys(obj)[0]);
				let value = parseInt(obj[key][0]);
				let lastMessage = obj[key][1]
				let chatId = obj[key][2]
				let unreadCount = obj[key][3]

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
				ads.dataValues['unreadCount'] = unreadCount
				adsResult.push([ads, user])
			}
      return res.json(adsResult)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new chatController()