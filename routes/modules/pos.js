const express = require('express')
const router = express.Router()
const posController = require('../../controllers/pos-controller')
const productController = require('../../controllers/product-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// login
router.post('/login', posController.login)
// 新增一個餐點品項
router.post('/products', authenticated, upload.fields([{ name: 'image', maxCount: 1 }]), productController.createProduct)

module.exports = router
