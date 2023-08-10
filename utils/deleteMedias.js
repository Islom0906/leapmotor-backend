const path = require('path')
const fs = require('fs')

const deleteMedias = (medias) => {
    medias.forEach((media) => {
         fs.unlink(path.join('media', media.name), (err) => {
            if (err) {
                console.log(err)
                return err
            }

             console.log('Successfully')
         })

    })
}

module.exports = deleteMedias