const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

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

app.listen(PORT, () => {
    console.log(`Система ArmyData запущена: http://localhost:${PORT}`)
})