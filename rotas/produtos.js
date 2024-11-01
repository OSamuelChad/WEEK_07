const express = require('express')
const router = express.Router()
const validarProdutos = require('../middleware/produtos.mid')
const { Produto, Tag } = require('../models')
const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const extensoes = /jpg|jpeg/i
  if (extensoes.test(path.extname(file.originalname))) {
    cb(null, true)
  }else{
    cb('Arquivo não suportado. Apenas pdf são suportados.')
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/', validarProdutos)
router.put('/', validarProdutos)

router.get('/', async (req, res) => {
  const produtos = await Produto.findAll({
    include: [
      {
        model: Tag,
      },
    ],
    raw: false,
    nest: true,
  })
  res.json({ produtos: produtos })
})

router.get('/:id', async (req, res) => {
  const produto = await Produto.findByPk(req.params.id, {
    include: [
      {
        model: Tag,
      },
    ],
    raw: false,
    nest: true,
  })
  res.json({ produto: produto })
})

router.post('/:id/upload', upload.single('foto'), async (req, res) => {
  const produto = await Produto.findByPk(req.params.id)
  if (produto) {
    produto.foto = `/static/uploads/${req.file.filename}`
    await produto.save()
    res.json({msg: "Upload realizado com sucesso!"})
  }else{
    res.status(400).json({ msg: "Produto não encontrado!" })
  }
})

router.post('/', async (req, res) => {
  const { tags, ...produto } = req.body;
  if (tags){
    const savedProduct = await Produto.create(produto)
    console.log(savedProduct)
    tags.forEach( async (tag) => {
      console.log(savedProduct.dataValues.id)
      await Tag.create({nome: tag, produtoId: savedProduct.dataValues.id})
    })
  }else{
    await Produto.create(req.body)
  }

  res.json({ msg: "Produto adicionado com sucesso!" })
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const produto = await Produto.findByPk(id)

  if (produto) {
    produto.nome = req.body.nome
    produto.descricao = req.body.descricao
    produto.preco = req.body.preco
    await produto.save()
    res.json({ msg: "Produto atualizado com sucesso!" })
  } else {
    res.status(400).json({ msg: "Produto não encontrado!" })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const produto = await Produto.findByPk(id)
  if (produto){
      await produto.destroy()
      res.json({msg: "Produto deletado com sucesso!"})
  }else{
    res.status(400).json({msg: "Produto não encontrado!"})
  }
})

module.exports = router;