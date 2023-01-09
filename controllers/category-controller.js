const { Category } = require('../models')

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
  }
}

module.exports = categoryController
