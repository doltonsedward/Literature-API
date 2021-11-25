const { literature, user } = require('../../models')

const Joi = require('joi')

exports.getLiterature = async (req, res) => {
    try {
        const response = await literature.findAll({
            include: [
                {
                    model: user,
                    as: "ownerLiterature",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"]
                    }
                }
            ]
        })

        res.send({
            status: "success",
            literatures: response
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.addLiterature = async (req, res) => {
    const { ...data } = req.body

    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        publication_date: Joi.date().required(),
        pages: Joi.number().required(),
        ISBN: Joi.number().min(13).required(),
        author: Joi.string().min(5).required()
    })

    const { error } = schema.validate(data)

    if (error) {
        return res.status(400).send({
            error: { message: error.details[0].message }
        })
    }
    
    try {
        const attache = req.file

        await literature.create({
            ...data,
            attache: attache.filename,
            userId: req.user.id
        })

        res.send({
            status: "success",
            message: "Add literature finished"
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.deleteLiterature = async (req, res) => {
    try {
        const { id } = req.params
        
        await literature.destroy({
            where: {
                id
            }
        })

        res.send({
            status: "success",
            message: `Delete literature with id: ${id} finished`
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}
