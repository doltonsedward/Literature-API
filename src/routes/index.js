const express = require('express')
const { register, login, checkAuth } = require('../controllers/auth')
const { auth } = require('../middlewares/auth')
const { getLiterature, addLiterature, deleteLiterature, searchLiterature, detailLiterature, updateLiterature } = require('../controllers/literature')
const { uploadFile } = require('../middlewares/uploadFile')
const { updateUser } = require('../controllers/user')
const { uploadImage } = require('../middlewares/uploadImage')
const { getCollection, addCollection } = require('../controllers/collection')
const { getOwnerLiterature } = require('../controllers/profile')

const router = express.Router()

// user or profile
router.patch('/user', auth, uploadImage("avatar", "uploads/avatar-external"), updateUser)
router.get('/profile/:profile_id/literature', getOwnerLiterature)

// literature session
router.get('/literatures', getLiterature)
router.get('/literature/:literature_id', detailLiterature)
router.get('/search-literatures', searchLiterature)
router.post('/literature', auth, uploadFile("attache", "uploads/literatures"), addLiterature)
router.patch('/literature/:literature_id', auth, updateLiterature)
router.delete('/literature/:literature_id', auth, deleteLiterature)

// collection session
router.get('/collection/:profile_id', auth, getCollection)
router.post('/collection/:literature_id', auth, addCollection)

// login regis session
router.post('/register', register)
router.post('/login', login)

router.get('/check-auth', auth, checkAuth)

module.exports = router