const Usuario = require('../models/usuarioModel')



hashCode = function(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
    };





const listaTodosUsuarios = async (req, res) => {
    try {
        const todosUsuarios = await Usuario.find()
        res.status(200).json(todosUsuarios)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const criaUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body)
        res.status(201).json(usuario)  
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const listaUmUsuario = async (req, res) => {
    try {
        const {id:usuarioId} = req.params
        const umUsuario = await Usuario.findOne({_id:usuarioId})
        if (!umUsuario) {
            return res.status(404).json({msg:`Nao existe um usuario com o id: ${usuarioId}`})
        }
        res.status(200).json(umUsuario)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const updateUsuario = async (req, res) => {
    try {
        const {id:usuarioId} = req.params
        const umUsuario = await Usuario.findOneAndUpdate({_id:usuarioId}, req.body, {
            new:true,
            runValidators:true
        })
        if (!umUsuario) {
            return res.status(404).json({msg:`Nao existe um usuario com o id: ${usuarioId}`})
        }
        res.status(200).json(umUsuario)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const deleteUsuario = async (req, res) => {
    try {
        const {id:usuarioId} = req.params
        const umUsuario = await Usuario.findOneAndDelete({_id:usuarioId})
        if (!umUsuario) {
            return res.status(404).json({msg:`Nao existe um usuario com o id: ${usuarioId}`})
        }
        res.status(204).json({msg: "deletado com sucesso!"})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

const criaHash = async (req, res) => {
    try {
        const hash = hashCode(req.body.hash)
        res.status(201).json(hash)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


module.exports = {
    listaTodosUsuarios,
    criaUsuario,
    listaUmUsuario,
    updateUsuario,
    deleteUsuario,
    criaHash
}