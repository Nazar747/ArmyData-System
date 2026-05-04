const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'))
})

app.get('/log-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'log-in.html'))
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'))
})

const connect_db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Зв'язок із базою даних успішний")
    } catch (err) {
        console.error("Помилка підключення до бази даних: ", err.message)
        process.exit(1)
    }
}

connect_db().then(() => {
    app.listen(PORT, () => {
        console.log(`Система ArmyData запущена: http://localhost:${PORT}`)
    })
})