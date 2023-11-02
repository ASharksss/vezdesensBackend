require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandingMiddleware')

const PORT = process.env.PORT


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)


//Обработка ошибок последний middleware
app.use(errorHandler)


const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync().then(() => console.log('успешно'))
      .catch((error) => console.error('Error', error))
    app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start().then(() => console.log('все супер пупер'))
