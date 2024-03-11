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
			const [data,] = await chatDB.query(
				`SELECT
								c.adId,
								c.id,
								cu.senderId,
								cu.receiverId,
								MAX(m.createdAt) AS lastMessage,
								SUM(IF(m.receiverRead = 0 AND m.senderId != ${userId}, 1, 0)) AS unreadCount
						FROM chats c
						JOIN chat_users cu ON c.id = cu.chatId
						LEFT JOIN messages m ON c.id = m.chatId
						WHERE cu.senderId = ${userId} OR cu.receiverId = ${userId}
						GROUP BY c.adId, cu.senderId, cu.receiverId, c.id
            			ORDER BY lastMessage DESC;`)
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
				ads.dataValues['lastMessage'] = lastMessage
				ads.dataValues['receiver'] = receiver
				ads.dataValues['senderId'] = sender.dataValues.id
				ads.dataValues['chat'] = chatId
				ads.dataValues['unreadCount'] = unreadCount
				adsResult.push([ads, receiver])
			}
      return res.json(adsResult)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new chatController()
