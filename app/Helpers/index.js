'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
 * Generate random string
 * 
 * @param { int } length 
 * @return { string }
 */

const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if(len < length) {
        let size = length - len
        let bytes = await crypto.randomBytes(size)
        let buffer = new Buffer(bytes)
        string += buffer
            .toString('base64')
            .replace(/[^a-zA-Z0-0]/g, '')
            .substr(0, size)
    }

    return string
}

/**
 * Move um único arquivo para o caminho especificado, se nenhum for especificado
 * então move para 'public/uploads'.
 * 
 * @param { FileJar } file
 * @param { string } path
 */

 const manage_single_upload = async (file, path = null) => {
     path = path ? path : Helpers.publicPath('uploads')

     const random_name = await str_random(30)
     let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

     await file.move(path, {
         name: filename
     })

     return file
 }

/**
 * Move múltiplos arquivos para o caminho especificado, se nenhum for especificado
 * então move para 'public/uploads'.
 * @param { FileJar } file
 * @param { string } path
 * @return { Object }
 */

 const manage_multiples_upload = async (fileJar, path = null) => {
     path = path ? path : Helpers.publicPath('uploads')
     let succeses = [],
        errors = []

     await Promise.all(fileJar.files.map(async file =>{
        let random_name = await str_random(30)
        let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

        await file.move(path, {
            name: filename,
        })

        if(file.moved()) {
            succeses.push(file)
        } else {
            errors.push(file.error())
        }

     }))

     return { succeses, errors }     
 }

module.exports = { str_random, manage_single_upload, manage_multiples_upload }