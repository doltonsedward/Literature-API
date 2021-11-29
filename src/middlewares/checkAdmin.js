const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')

exports.checkAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    const tokenDecode = jwt_decode(token) // decoded token

    // check if role in token is admin or not
    if (tokenDecode.role !== 'admin') {
        console.log(tokenDecode.role)
        return res.status(400).send({ message: "Access Denied!, you are not admin" })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = verified

        next()
    } catch (error) {
        req.status(400).send({ message: "Invalid token" })
    }
}