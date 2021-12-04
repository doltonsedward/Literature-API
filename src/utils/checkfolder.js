const fs = require('fs')
const literature_dir = './uploads/literatures'

const checkFolder = () => {
    if (!fs.existsSync(literature_dir)) {
        return fs.mkdirSync(literature_dir)
    }
}

module.exports = checkFolder