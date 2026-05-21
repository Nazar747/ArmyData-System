const User = require('../models/user')
const Fighter = require('../models/fighter')

const register = async (req, res) => {
    try {
        const { email, password } = req.body

        const existing_user = await User.findOne({ email })
        if (existing_user) {
            return res.status(400).json({message: 'Користувач з такий email вжу існує'})
        }

        const user = await User.create({ email, password })
        
        const fighter = await Fighter.findOne({ email })
        if (fighter) {
            fighter.user = user._id
            await fighter.save()
        }

        req.session.user_id = user._id
        req.session.role = user.role

        res.status(201).json({message: 'Реєстрація успішна'})
    } catch (err) {
        res.status(500).json({message: 'Помилка сервера: ' + err.message})
    }
}

module.exports = {register}