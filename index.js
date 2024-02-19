require('dotenv').config()
const cookieParser = require('cookie-parser');
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const path = require('path')
const sequelize = require('./db')
const models = require('./models')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandingMiddleware')
const position = require("./middleware/GeoHandingMiddleware");

const PORT = process.env.PORT
const originAccess = process.env.originAccess || '["https://vezdesens.ru"]'

const app = express()
app.use(cors({ credentials: true, origin: JSON.parse(originAccess),
	allowedHeaders: ['Content-Type', 'Authorization', 'Position'], methods: ['GET', 'POST', 'OPTIONS', 'DELETE']}))
app.use(express.json())
app.use(cookieParser());
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}));
app.use('/api', position.checkPosition, router)


//Обработка ошибок последний middleware
app.use(errorHandler)

app.get('/ping', (req, res) => {
  res.json('pong')
})

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync().then(() => console.log('успешно'))
      .catch((error) => console.error('Error', error))
    await sequelize.chatDB.authenticate()
    app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start().then(() => console.log('все супер пупер'))
