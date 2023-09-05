const ApiError = require('../error/ApiError')
const events = require('events')

const emitter = new events.EventEmitter()

  class chatController {

    async addDialogues(req, res, next) {
      try {
        const {idAd} = req.body
        return res.json(idAd)
      } catch (e) {
        return next(ApiError.badRequest(e.message))
      }
    }

    async addMessage(req, res, next) {
      try {
        const {message} = req.body
        emitter.emit('newMessage', message)
        return res.json(message)
      } catch (e) {
        return next(ApiError.badRequest(e.message))
      }
    }

    async getMessages(req, res, next) {
      try {
        const {idChat} = req.query

        emitter.once('newMessages', (message) => {
          res.json(message)
        })

      } catch (e) {
        return next(ApiError.badRequest(e.message))
      }
    }
  }


  module.exports = new chatController()