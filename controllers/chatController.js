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
			if (ids.length > 0) {
				const [data,] = await chatDB.query(
					`SELECT count(*) as count FROM messages where receiverRead=0 and senderId != ${userId} and chatId in (${ids.map(item => item.id).toString()});`)
				return res.json(data[0])
			}
			return res.json({count: 0})
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

  async getMessages(req, res, next) {
    try {
			const userId = req.user
			let adsResult = []
		console.log({userId})
			const [data,] = await chatDB.query(
				`SELECT
						subquery.adId,
						subquery.senderId,
						subquery.receiverId,
						MIN(subquery.lastMessage) AS lastMessage,
						COALESCE(SUM(subquery.unreadCount), 0) AS unreadCount
					FROM (
						SELECT
							chats.adId,
							users.senderId,
							COALESCE(users.receiverId, 0) AS receiverId,
							messages.createdAt AS lastMessage,
							COUNT(CASE WHEN messages.receiverRead = 0 THEN 1 ELSE NULL END) AS unreadCount
						FROM messages
						LEFT JOIN chats ON messages.chatId = chats.id
						LEFT JOIN chat_users AS users ON users.chatId = messages.chatId
						WHERE users.senderId != messages.senderId
						GROUP BY chats.adId, users.senderId, receiverId, messages.createdAt
					) AS subquery
					WHERE subquery.senderId = ${userId}
					GROUP BY subquery.adId, subquery.senderId, subquery.receiverId;`)
			const newData = data.reduce((o, i) => {
				if (!o.find(v => v.id === i.id)) {
					o.push(i);
				}
				return o;
			}, []);
			const adIds = newData.map(item => {
				return {
					[item.adId]: [item.senderId, item.lastMessage, item.id, item.unreadCount, item.receiverId]
				}
			})
			for (const obj of adIds) {
				let key = parseInt(Object.keys(obj)[0]);
				let value = parseInt(obj[key][0]);
				let lastMessage = obj[key][1]
				let chatId = obj[key][2]
				let unreadCount = obj[key][3]
				let receiverId = obj[key][4]

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
				const sender = await User.findOne({
					where: {id: value},
					attributes: ['id', 'name']
				})
				const receiver = await User.findOne({
					where: {id: receiverId},
					attributes: ['id', 'name']
				})
				console.log(receiver)
				ads.dataValues['lastMessage'] = lastMessage
				ads.dataValues['chat'] = chatId
				ads.dataValues['unreadCount'] = unreadCount
				adsResult.push([ads, sender])
			}
      return res.json(adsResult)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new chatController()