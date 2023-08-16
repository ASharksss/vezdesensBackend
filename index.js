require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models.js')

const PORT = process.env.PORT

const app = express()


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({force: true})
        app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start().then(() => console.log('все супер пупер'))
