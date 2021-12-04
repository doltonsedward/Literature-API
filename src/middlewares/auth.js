const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(400).send({ message: "Access Denied!, login first" })

    try {
        const verified = jwt.verify(token, process.env.TKEY)
        req.user = verified
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "Invalid Token" })
    }
}