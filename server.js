const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()

const auth_routes = require('./routes/auth-routes')
const fighter_routes = require('./routes/fighter-routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use('/api/auth', auth_routes)
app.use('/api/fighters', fighter_routes)

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

app.get('/fighters', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fighters.html'))
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