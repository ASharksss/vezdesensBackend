require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models')
const cors = require('cors')

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json)

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
start()
