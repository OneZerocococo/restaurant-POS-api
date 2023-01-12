const { Order, Table, SoldProduct, Product } = require('../models')

const orderController = {
  // 開桌設定人數
  setOrder: async (req, res, next) => {
    try {
      const tableId = req.params.table_id
      const { adultNum, childrenNum } = req.body
      const table = await Table.findByPk(tableId)
      if (!table) throw new Error('桌號不存在')
      const newOrder = await Order.create({ tableId, adultNum, childrenNum })
      const data = newOrder.toJSON()
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getOrderByTable: async (req, res, next) => {
    try {
      const tableId = req.params.table_id
      const order = await Order.findOne({
        where: {
          tableId,
          isPaid: false
        },
        raw: true
      })
      const soldProducts = await SoldProduct.findAll({
        where: {
          orderId: order.id
        },
        include: [Product],
        raw: true,
        nest: true
      })
      // 算訂單總額
      const priceByProduct = soldProducts.map(product => product.count * product.Product.price)
      const totalPrice = priceByProduct.reduce((a, c) => a + c, 0)
      order.totalPrice = totalPrice
      await Order.update(
        { totalPrice },
        { where: { id: order.id } }
      )
      const updateData = await Order.findByPk(order.id, {
        attributes: { exclude: ['TableId'] },
        raw: true
      })
      res.status(200).json(updateData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = orderController
