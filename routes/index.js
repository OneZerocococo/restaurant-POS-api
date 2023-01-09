const express = require('express')
const router = express.Router()
const errorHandler = require('../middleware/error-handler')
const pos = require('./modules/pos')
const category = require('./modules/category')

router.use('/pos', pos)
router.use('/categories', category)
router.use(errorHandler)

module.exports = router
