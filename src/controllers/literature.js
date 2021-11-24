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

exports.addLiterature = async (req, res) => {
    try {
        const { ...data } = req.body
        const attache = req.file

        console.log(attache)
        console.log(data)

        res.send({
            status: "success"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "Internal server error"
        })
    }
}

