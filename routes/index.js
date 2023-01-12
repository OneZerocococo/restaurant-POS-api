const express = require('express')
const router = express.Router()
const errorHandler = require('../middleware/error-handler')
const pos = require('./modules/pos')
const category = require('./modules/category')
const order = require('./modules/order')

router.use('/pos', pos)
router.use('/categories', category)
router.use('/order', order)
router.use(errorHandler)

module.exports = router
