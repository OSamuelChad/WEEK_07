const express = require('express')
const router = express.Router()
const { Produto, Tag } = require('../models')
const moment = require('moment')
moment.locale('pt-br')
router.get('/', async (req, res) => {
        const produtos = await Produto.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Tag
            }], raw: true, nest: true
        });
    
        const produtoResult = produtos.map((produto) => prepararResultado(produto));
        res.render('pages/produtos', {produtos: produtoResult, layout: 'layouts/layout-home.ejs'});
    });

router.get('/produto/:id', async (req, res) => {
        const produto = await Produto.findByPk(req.params.id, 
            {include: [{model: Tag}], raw: true, nest: true});
        res.render('pages/produto', {produto: prepararResultado(produto), layout: 'layouts/layout-home.ejs'});
    });
    
    

function prepararResultado(produto){

        const result = Object.assign({}, produto)
        result.produtoadoEm = moment(new Date(result.createdAt)).format('DD [de] MMMM [de] yyyy [as] HH:mm')

        if (result.createdAt) delete result.createdAt
        if (result.updatedAt) delete result.updatedAt
        if (result.userId) delete result.userId
        if (result.Tag){
                if (result.Tag.createdAt) delete result.Tag.createdAt
                if (result.Tag.updatedAt) delete result.Tag.updatedAt
        }
        return result
}

module.exports = router