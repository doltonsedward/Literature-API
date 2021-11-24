require('dotenv').config()

// import library
const express = require('express')
const cors = require('cors')

const app = express()
const router = require('./src/routes')
const port = 8000

app.use(express.json())
app.use(cors())

app.use('/api/v1', router)
app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT || port, 
    ()=> console.log('Server running at port: ', port))