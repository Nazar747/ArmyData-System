const { Router } = require('express')
const router = Router()

router.post('/register', (req, res) => {
    res.json({message: 'Реєстрація працює!'})
})

router.post('/login', (req, res) => {
    res.json({message: 'Вхід працює!'})
})

router.get('/logout', (req, res) => {
    res.json({message: 'Вихід працює!'})
})

module.exports = router