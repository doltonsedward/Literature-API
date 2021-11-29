const { user } = require('../../models')

const Joi = require('joi')

exports.updateUser = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(8).required(),
        gender: Joi.string().required(),
        phone: Joi.string().min(8),
        address: Joi.string().min(8)
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    }
    
    try {
        const { id } = req.user

        await user.update({
            ...req.body,
            avatar: `${process.env.PATH_AVATAR_EXTERNAL}/${req.file.filename}`
        }, {
            where: {
                id
            }
        })

        res.send({
            status: "success",
            message: `Update profile finished`
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.updateUserSpecificData = async (req, res) => {
    try {
        const { id } = req.user
        
        await user.update({
            ...req.body
        }, {
            where: {
                id
            }
        })

        res.send({
            status: "success",
            message: `Update profile finished`
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}