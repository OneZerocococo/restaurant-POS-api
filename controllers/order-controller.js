const { Order, Table, SoldProduct, Product } = require('../models')

const orderController = {
  // 開桌設定人數
  setOrder: async (req, res, next) => {
    try {
      const tableId = req.params.table_id
      // 若已經開桌有單號未結帳，禁止再次開桌
      const isOrdered = await Order.findOne({ where: { tableId, isPaid: false } })
      if (isOrdered) throw new Error('該桌已有人')
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
      if (!order) throw new Error('該桌無未結帳訂單!')
      // 取得訂單內容
      const soldProducts = await SoldProduct.findAll({
        where: {
          orderId: order.id
        },
        attributes: ['productId', 'count'],
        include: [{ model: Product, attributes: ['name', 'price'] }],
        raw: true,
        nest: true
      })
      // 算訂單總額
      const priceByProduct = soldProducts.map(p => p.count * p.Product.price)
      const totalPrice = priceByProduct.reduce((a, c) => a + c, 0)
      order.totalPrice = totalPrice
      await Order.update(
        { totalPrice },
        { where: { id: order.id } }
      )
      const updateData = await Order.findByPk(order.id, {
        raw: true
      })
      updateData.soldProducts = soldProducts
      res.status(200).json(updateData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = orderController
