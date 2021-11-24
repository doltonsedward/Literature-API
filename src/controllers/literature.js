const { literature } = require('../../models')

exports.getLiterature = async (req, res) => {
    try {
        const response = await literature.findAll()

        res.send({
            status: "success",
            literature: response
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

