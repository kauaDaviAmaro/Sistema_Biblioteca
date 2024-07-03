
const { Op } = require('sequelize');
const Usuarios = require('../models/usuarios');

exports.login = async (req, res) => {
    try {
        const {email, senha, cpf} = req.body;
        const usuario = {
        [Op.or]: [
            await Usuarios.findOne({ where: {email, senha}}),
            await Usuarios.findOne({ where: {cpf, senha}})
        ]
        }
        const encontrarUsuario = await Usuarios.findOne({ where: usuario})
        if (encontrarUsuario) {
            return res.send(encontrarUsuario);
        }
        return res.status(404).send('Usuario not found');
    } catch (error ) {
        return res.status(500).send('Internal Server error')
    }
}

exports.getUsers = async (req, res) => {
    try {
        const { nome, email, papel} = req.query || {};

        if(!nome, !email, !papel) {
            const usuarios = Usuarios.findAll();
            return res.send(usuarios)
        }


        const pesquisa = {
            [Op.or]: [
                nome ? { nome: { [Op.like]: `%${nome}%` } } : undefined,
                email ? { email: { [Op.like]: `%${email}%` } } : undefined,
                papel ? { papel: { [Op.like]: `%${papel}%` } } : undefined
            ].filter(Boolean)
        }

        const usuarios = await Usuarios.findAll({ where: pesquisa})
        return res.send(usuarios)

    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Server Error');
    }
}

exports.getUsersByCpf = async (req, res) => {
    try {
        const encontrarUsuario = await Usuarios.findByPk(req.params.cpf);
        if (!encontrarUsuario) {
            return res.status(404).send('Usuario not found');
        }
        return res.send(encontrarUsuario);
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
}

exports.createUsuario = async (req, res) => {
    const verificacao = await Usuarios.findOne({ where:  { email: req.body.email}})

    if (verificacao){
        return res.send ('usuario ja foi cadastrado')
    }

    const usuarioCriado = await Usuarios.create(req.body)
    console.log(usuarioCriado)
    return res.send('usuario cadastrado com sucesso')
}

exports.deleteUsuario = async (req, res) => {
    const encontrarUsuario = await Usuarios.findOne({ where: {cpf: req.params.cpf}})
    try {
        await encontrarUsuario.destroy();
        return res.send('usuario deletado')
    } catch (err) {
        return res.send('aqui deu erro mn se liga', err)
    }
}

exports.updateUsuario = async (req, res) => {
    const Cpf = req.params.cpf
    const CpfUsuario = await Usuarios.findOne({where: {cpf: Cpf}})

    if (CpfUsuario) {
        try {
            const [Updates] = await Usuarios.update(req.body, { where: { cpf: req.params.cpf } }) // verifica se tem alguma alteração
            return res.send({ message: 'Usuario foi atualizado ;P', })

        } catch (error) {
            return res.send('deu erro aqui meu mano ==> ', error)

        }
    }
    return res.send ('usuario not found!!!')
}