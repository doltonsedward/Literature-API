const { literature, user } = require('../../models')

const Joi = require('joi')
const Op = require('sequelize').Op

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
            ],
            order: [['updatedAt', 'DESC']]
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

exports.detailLiterature = async (req, res) => {
    try {
        const { literature_id } = req.params
        
        const response = await literature.findOne({
            include: [
                {
                    model: user,
                    as: "ownerLiterature",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"]
                    }
                }
            ],
            where: {
                id: literature_id
            }
        })

        res.send({
            status: "success",
            literature: response
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.searchLiterature = async (req, res) => {
    try {
        const { title, public_year } = req.query
        
        const response = await literature.findAll({
            where: {
                [Op.or]: [
                    {title: {
                        [Op.like]: `%${title}%`
                    }}, 
                    {publication_date: {
                        [Op.like]: `%${public_year}%`
                    }}
                ]
            },
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

        const literatures = response.map(item => {
            const publicDateInString = JSON.stringify(item.publication_date)
            const newPublicDate = publicDateInString.split(':')[0].slice(1, 11).split('-').reverse().join('-')

            item["publication_date"] = newPublicDate

            return item
        })

        res.send({
            status: "success",
            literatures
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
        const allLiterature = await literature.findAll()
        
        const isAlreadyExist = allLiterature.find(item => item.title.split(" ").join("") == data.title.split(" ").join(""))

        if (isAlreadyExist) {
            return res.status(400).send({
                status: "failed",
                message: "Title already exist"
            })
        }
        
        const attache = req.file

        await literature.create({
            ...data,
            attache: process.env.PATH_LITERATURE + attache.filename,
            userId: req.user.id,
            status: 'Waiting'
        })

        res.send({
            status: "success",
            message: "Add literature finished"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.updateLiterature = async (req, res) => {
    try {
        const { literature_id } = req.params

        await literature.update({
            ...req.body
        }, {
            where: {
                id: literature_id
            }
        })

        res.send({
            status: "success",
            message: "Update literature finished"
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
        const { literature_id } = req.params

        const data = await literature.findOne({
            where: {
                id: literature_id
            }
        })

        fs.readdir('./uploads/literatures', (err, files) => {
            files.map((item) => {
                if (data.image.indexOf(item) !== -1) {
                    fs.unlinkSync(path.join(__dirname, '../../uploads/literatures/' + item))
                }
            })
        })
        
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
