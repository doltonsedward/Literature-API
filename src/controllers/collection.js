const { collection, literature } = require('../../models')

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
                }
            ],
            where: {
                id: profile_id
            }
        })

        console.log(response)

        res.send({
            status: "success",
            collection: response
        })
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

// exports.addCollection = async () => {
//     try {
        
//     } catch (error) {
        
//     }
// }