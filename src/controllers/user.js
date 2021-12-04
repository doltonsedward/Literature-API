const { user } = require('../../models')

const fs = require('fs')
const cloudinary = require('../thirdparty/cloudinary')
const checkFolder = require('../utils/checkfolder')

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.user

        const pathfile = req.file.path
        cloudinary.uploader.upload(pathfile, { folder: 'avatar-literature' }, async (error, result) => {
            if (error) {
                return res.status(500).send({
                    status: "failed",
                    message: "Upload file failed"
                })
            }

            await user.update({
                ...req.body,
                avatar: result.secure_url
            }, {
                where: {
                    id
                }
            })

            fs.rmdirSync('./uploads/avatar-external', { recursive: true })
            checkFolder()

            return res.send({
                status: "success",
                message: result
            })
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