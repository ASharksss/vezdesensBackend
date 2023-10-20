const ApiError = require('../error/ApiError')
const events = require('events')
const {MessageChat, Chat} = require("../models");
const {text} = require("express");

const emitter = new events.EventEmitter()

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
      const {chatId} = req.query
      const messages = await MessageChat.findAll({
        where: chatId
      })
      return res.json(messages)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}


module.exports = new chatController()