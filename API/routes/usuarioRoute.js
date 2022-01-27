const express = require('express')
const router = express.Router()
const {listaTodosUsuarios, criaUsuario, listaUmUsuario, updateUsuario, deleteUsuario, criaHash} = require('../controllers/usuarioController')


router.route('/').get(listaTodosUsuarios)
router.route('/').post(criaUsuario)
router.route('/:id').get(listaUmUsuario)
router.route('/:id').put(updateUsuario)
router.route('/:id').delete(deleteUsuario)
router.route('/gerarHash').post(criaHash)




module.exports = router