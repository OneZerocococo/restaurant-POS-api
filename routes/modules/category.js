const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/category-controller')
const { authenticated } = require('../../middleware/auth')

// 取得所有類別
router.post('/', authenticated, categoryController.addCategory)
router.get('/', categoryController.getCategories)

module.exports = router
