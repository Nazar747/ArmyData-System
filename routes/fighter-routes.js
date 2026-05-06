const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.json({message: 'Список бійців працює!'})
})

router.get('/:id', (req, res) => {
    res.json({message: 'Один боєць працює!'})
})

router.post('/', (req, res) => {
    res.json({message: 'Додавання бійця працює!'})
})

router.put('/:id', (req, res) => {
    res.json({message: 'Редагування бійця працює!'})
})

router.delete('/:id', (req, res) => {
    res.json({message: 'Видалення бійця працює!'})
})

module.exports = router