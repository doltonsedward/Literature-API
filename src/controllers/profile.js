const { literature, user } = require('../../models')

exports.getOwnerLiterature = async (req, res) => {
    try {
        const { profile_id } = req.params

        const response = await literature.findAll({
            include: [
                {
                    model: user,
                    as: "ownerLiterature",
                    attributes: {
                        exclude: ["updatedAt", "createdAt", "password"]
                    },
                    where: {
                        id: profile_id
                    }
                }
            ],
        })

        const literatures = response.map(item => {
            const publicDateInString = JSON.stringify(item.publication_date)
            const newPublicDate = publicDateInString.split(':')[0].slice(1, 11).split('-').reverse()[2]

            item["publication_date"] = newPublicDate
            
            return item
        })

        res.send({
            status: "success",
            literatures
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}