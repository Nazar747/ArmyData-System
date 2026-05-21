const { Router } = require('express')
const router = Router()
const { register } = require('../controllers/auth-controller')

router.post('/register', register)

router.post('/login', (req, res) => {
    res.json({message: 'Вхід працює!'})
})

router.get('/logout', (req, res) => {
    res.json({message: 'Вихід працює!'})
})

module.exports = router