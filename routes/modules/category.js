const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/category-controller')
const { authenticated } = require('../../middleware/auth')

// 新增一個類別
router.post('/', authenticated, categoryController.addCategory)
// 刪除一個類別
router.delete('/:id', authenticated, categoryController.deleteCategory)
// 取得所有類別
router.get('/', categoryController.getCategories)

module.exports = router
