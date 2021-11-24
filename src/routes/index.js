const express = require('express')
const { register, login } = require('../controllers/auth')
const { getLiterature } = require('../controllers/literature')

const router = express.Router()

router.get('/literatures', getLiterature)

// login regis session
router.post('/register', register)
router.post('/login', login)

module.exports = router