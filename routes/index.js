const express = require('express')
const router = express.Router()
const errorHandler = require('../middleware/error-handler')
const pos = require('./modules/pos')

router.use('/pos', pos)
router.use(errorHandler)

module.exports = router
