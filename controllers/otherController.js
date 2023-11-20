const path = require('path');

class OtherController {
  async sendImage(req, res, next) {
    const {name} = req.params
    res.sendFile(path.join(__dirname, `../asserts/images/${name}`))
  }
}

module.exports = new OtherController()