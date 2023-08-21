require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
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
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

app.get('/', (req, res) => {
    res.status(200).json({message: 'Работаем!!!'})
})
start().then(() => console.log('все супер пупер'))
