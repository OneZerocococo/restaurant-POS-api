const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/category-controller')

// 取得所有類別
router.get('/', categoryController.getCategories)

module.exports = router
