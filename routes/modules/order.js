const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

// 取得桌號(未結帳)訂單
router.get('/:table_id', orderController.getOrderByTable)

module.exports = router
