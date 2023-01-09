const { Category, Product } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true
      })
      res.status(200).json(categories)
    } catch (err) {
      next(err)
    }
  },
  addCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name.trim()) throw new Error('內容不可空白')
      const data = await Category.create({ name })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findByPk(categoryId, { raw: true })
      if (!category) throw new Error('分類不存在')
      await Category.destroy({ where: { id: categoryId } })
      res.status(200).json(category)
    } catch (err) {
      next(err)
    }
  },
  editCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const { name } = req.body
      if (!name.trim()) throw new Error('內容不可空白')
      const category = await Category.findByPk(categoryId)
      if (!category) throw new Error('分類不存在')
      const editedCategory = await category.update({ name })
      const categorydata = editedCategory.toJSON()
      res.status(200).json(categorydata)
    } catch (err) {
      next(err)
    }
  },
  getCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findByPk(categoryId)
      if (!category && categoryId !== '0') throw new Error('分類不存在')
      // 取得有分類的商品
      if (categoryId !== '0') {
        const classifiedProducts = await Product.findAll({
          where: { categoryId },
          attributes: {
            exclude: ['cost', 'createdAt', 'updatedAt']
          },
          raw: true
        })
        res.status(200).json(classifiedProducts)
        // 取得未分類商品
      } else {
        const products = await Product.findAll({
          where: { categoryId: null },
          attributes: {
            exclude: ['cost', 'createdAt', 'updatedAt']
          },
          raw: true
        })
        res.status(200).json(products)
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
