const express = require('express')
const router = express.Router()
const revenueController = require('../../controllers/revenue-controller')
const { authenticated } = require('../../middleware/auth')

// 關帳
router.post('/closedailyrevenue', authenticated, revenueController.closeDailyRevenue)
// 取得未結算營收(系統金額)
router.get('/unsettledrevenue', authenticated, revenueController.getUnsettledRevenue)

module.exports = router
