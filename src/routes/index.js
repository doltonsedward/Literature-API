const express = require('express')
const { register, login, checkAuth } = require('../controllers/auth')
const { auth } = require('../middlewares/auth')
const { getLiterature, addLiterature, deleteLiterature, searchLiterature } = require('../controllers/literature')
const { uploadFile } = require('../middlewares/uploadFile')
const { updateUser } = require('../controllers/user')
const { uploadImage } = require('../middlewares/uploadImage')
const { getCollection } = require('../controllers/collection')

const router = express.Router()

router.patch('/user', auth, uploadImage("avatar", "uploads/avatar-external"), updateUser)

// literature session
router.get('/literatures', getLiterature)
router.get('/search-literatures', searchLiterature)
router.post('/literatures', auth, uploadFile("attache", "uploads/literatures"), addLiterature)
router.delete('/literatures/:id', auth, deleteLiterature)

// collection session
router.get('/collection/:profile_id', auth, getCollection)

// login regis session
router.post('/register', register)
router.post('/login', login)

router.get('/check-auth', auth, checkAuth)

module.exports = router