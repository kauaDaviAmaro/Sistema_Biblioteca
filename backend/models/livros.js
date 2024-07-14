const Sequelize = require('sequelize')
const database = require('../config/sequelize')
const { default_type } = require('mime');
const autores = require('./autores')
import { DataTypes } from '@sequelize/core';

const livros = database.define('livros', {

    id_livro: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    genero: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_criacao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    editora: {
        type: Sequelize.STRING,
        defaultValue: "Sem editora"
    },
    qtd_disponivel: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_autor: {
        type: Sequelize.INTEGER,
        AllowNUll: false,
        references: {
            model: autores,
            key: 'id_autor'
        }, // referencia o nome da tabela
    },
    Imagem: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

autores.hasMany(livros, {
    foreignKey: 'id_autor'
})

livros.belongsTo(autores, {
    foreignKey: 'id_autor'
});

module.exports = livros