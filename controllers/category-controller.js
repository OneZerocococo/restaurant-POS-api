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
  }
}

module.exports = categoryController
