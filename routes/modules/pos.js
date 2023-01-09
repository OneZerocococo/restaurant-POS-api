const express = require('express')
const router = express.Router()
const posController = require('../../controllers/pos-controller')

// login
router.post('/login', posController.login)

module.exports = router
