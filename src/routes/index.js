const express = require('express')
const { register, login, checkAuth } = require('../controllers/auth')
const { auth } = require('../middlewares/auth')
const { getLiterature, addLiterature, deleteLiterature } = require('../controllers/literature')
const { uploadFile } = require('../middlewares/uploadFile')

const router = express.Router()

router.get('/literatures', getLiterature)
router.post('/literatures', auth, uploadFile("attache", "uploads/literatures"), addLiterature)
router.delete('/literatures/:id', auth, deleteLiterature)

// login regis session
router.post('/register', register)
router.post('/login', login)

router.get('/check-auth', auth, checkAuth)

module.exports = router