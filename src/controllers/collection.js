const { collection, literature, user } = require('../../models')

exports.getCollection = async (req, res) => {
    try {
        const { profile_id } = req.params

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
                        id: profile_id
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

exports.addCollection = async (req, res) => {
    try {
        const { id } = req.user
        const { name } = req.body
        const { literature_id } = req.params
        
        await collection.create({
            name: name ?? 'My Collection',
            userId: id,
            literatureId: literature_id
        })

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