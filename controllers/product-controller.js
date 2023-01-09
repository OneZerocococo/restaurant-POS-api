const { Product } = require('../models')
const imgurFileHandler = require('../helpers/imgur-file-helper')

const productController = {
  createProduct: async (req, res, next) => {
    try {
      const { categoryId, name, nameEn, description, cost, price } = req.body
      if (!name || !price) throw new Error('請輸入名稱和價格!')
      const { files } = req
      if (description?.length || nameEn?.length > 100) throw new Error('請輸入100字以內')
      if (!name || name.length > 20) throw new Error('請輸入20字以內')
      const image = await imgurFileHandler(files?.image && files.image[0])
      const createdProduct = await Product.create({
        categoryId,
        name,
        nameEn,
        description,
        image,
        cost,
        price
      })
      const data = await Product.findByPk(createdProduct.id, { raw: true })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController
