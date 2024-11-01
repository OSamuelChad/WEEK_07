'use strict';
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Produto extends Model {

    static associate(models) {
      Produto.hasMany(models.Tag, {foreignKey: 'produtoId'});
    }
    
  };

  Produto.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    preco: DataTypes.REAL,
    foto: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Produto',
  });

  return Produto;

};