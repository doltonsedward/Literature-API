const fs = require('fs')
const literature_dir = './uploads/literatures'
const avatar_external_dir = './uploads/avatar-external'

const checkFolder = () => {
    if (!fs.existsSync(literature_dir)) { 
        fs.mkdirSync(literature_dir)
    }

    if (!fs.existsSync(avatar_external_dir)) { 
        fs.mkdirSync(avatar_external_dir)
    }
}

module.exports = checkFolder