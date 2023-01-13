const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

// 顧客送出訂單
router.put('/:table_id/:order_id', orderController.customerOrder)
// 取得桌號(未結帳)訂單
router.get('/:table_id', orderController.getOrderByTable)

module.exports = router
