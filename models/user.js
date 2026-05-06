const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const user_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    fullName: {
        type: String,
        default: ''
    },
    rank: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    position: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    }
}, {
    timestamps: true 
})

user_schema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

user_schema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', user_schema)