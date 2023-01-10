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
// 編輯一個餐點品項
router.put('/products/:id', authenticated, upload.fields([{ name: 'image', maxCount: 1 }]), productController.editProduct)
// 取得所有桌號
router.get('/tables', authenticated, posController.getTables)
// 編輯基本設定
router.put('/settings', authenticated, posController.editSettings)
// 取得基本設定
router.get('/settings', authenticated, posController.getSettings)

module.exports = router
