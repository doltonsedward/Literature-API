const { collection, literature, user } = require('../../models')

exports.getCollection = async (req, res) => {
    try {
        const { id } = req.user

        const response = await collection.findAll({
            include: [
                {
                    model: literature,
                    as: "literature",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: user,
                    as: "ownerCollection",
                    where: {
                        id
                    }
                },
            ],
        })

        const collections = response.map(item => {
            const publicDateInString = JSON.stringify(item.literature.publication_date)
            const newPublicDate = publicDateInString.split(':')[0].slice(1, 11).split('-').reverse().join('-')

            item.literature["publication_date"] = newPublicDate

            return item
        })

        res.send({
            status: "success",
            collection: collections
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.getCollectionByLiterature = async (req, res) => {
    try {
        const { id } = req.user
        const { literature_id } = req.params

        const response = await collection.findOne({
            include: [
                {
                    model: literature,
                    as: "literature",
                    attributes: {
                        exclude: ["updatedAt", "createdAt"]
                    },
                    where: {
                        id: literature_id
                    }
                },
                {
                    model: user,
                    as: "ownerCollection",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    where: {
                        id
                    }
                }
            ]
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

exports.addCollection = async (req, res) => {
    try {
        const { id } = req.user
        const { name } = req.body
        const { literature_id } = req.params
        
        const response = await collection.create({
            name: name ? name : 'My Collection',
            userId: id,
            literatureId: literature_id
        })

        console.log(response)

        res.send({
            status: "success",
            message: "Add collection finished"
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

exports.deleteCollection = async (req, res) => {
    try {
        const { collection_id } = req.params
        
        await collection.destroy({
            where: {
                id: collection_id
            }
        })

        res.send({
            status: "success",
            message: `Delete collection id: ${collection_id} finished`
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}