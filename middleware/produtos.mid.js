const Ajv = require('ajv')
const ajv = new Ajv()
const model = require('../schemas/produtos.schema')

function validaProduto(req, res, next) {
    const post = req.body
    const validate = ajv.compile(model)
    const valid = validate(post)
    if (valid) {
        next()
    } else {
        res.status(400).json({ msg: "Falha ao adicionar o Produto.", errors: validate.errors })
    }
}

module.exports = validaProduto