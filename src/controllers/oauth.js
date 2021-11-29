const { user } = require('../../models')
const { OAuth2Client } = require('google-auth-library')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const client = new OAuth2Client(process.env.CLIENT_ID)

exports.oauthGoogle = async (req, res) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.CLIENT_ID
        })

        const { name, email, picture } = ticket.getPayload()

        const dataUser = await user.findOne({
            where: {
                email
            }
        })

        const hashedPass = await bcrypt.hash(req.body.password, 10) 

        let data
        let token

        if (dataUser) {
            data = await user.update({
                fullName: name,
                role: 'user'
            }, {
                where: {
                    id: dataUser.id
                }
            })

            token = jwt.sign({ id: dataUser.id, role: dataUser.role }, process.env.TKEY) 

            return res.send({
                status: "success",
                user: {
                    token
                }
            })
        } 

        data = await user.create({
            fullName: name,
            email,
            password: hashedPass,
            phone: '-',
            gender: '-',
            role: 'user',
            avatar: picture
        })

        token = jwt.sign({ id: data.id, role: data.role }, process.env.TKEY) 

        res.send({
            status: "success",
            user: {
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}