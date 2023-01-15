const { Order, Table, SoldProduct, Product, Setting } = require('../models')

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
  // 更新桌子人數
  updatePeopleNum: async (req, res, next) => {
    try {
      const tableId = req.params.table_id
      const table = await Table.findByPk(tableId)
      if (!table) throw new Error('桌號不存在')
      const order = await Order.findOne({
        where: { tableId, isPaid: false, isFinished: false },
        attributes: { exclude: ['totalPrice', 'isPaid', 'isFinished'] }
      })
      if (!order) throw new Error('尚未開桌!')
      const { adultNum, childrenNum } = req.body
      const newOrder = await order.update({ adultNum, childrenNum })
      res.status(200).json(newOrder)
    } catch (err) {
      next(err)
    }
  },
  // 取得單一桌號未結帳訂單
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
        include: [{ model: Table, attributes: ['name'] }],
        raw: true,
        nest: true
      })
      updateData.soldProducts = soldProducts
      res.status(200).json(updateData)
    } catch (err) {
      next(err)
    }
  },
  // 顧客送出訂單
  customerOrder: async (req, res, next) => {
    try {
      const tableId = Number(req.params.table_id)
      const orderId = Number(req.params.order_id)
      // 取得訂單內容，需計算低消
      const order = await Order.findOne({ where: { tableId, id: orderId, isPaid: false } })
      const settings = await Setting.findOne({ raw: true })
      // 取得大人均低消金額
      const minCharge = Number(settings.minCharge)
      // 取得點餐內容
      const orderedProducts = req.body
      if (orderedProducts[0].orderId !== orderId) throw new Error('req.body or req.params.order_id is not correct!')
      const priceByProduct = orderedProducts.map(p => p.count * p.sellingPrice)
      const totalPrice = priceByProduct.reduce((a, c) => a + c, 0)
      if (totalPrice / Number(order.adultNum) < minCharge) throw new Error('未達低消!')
      await SoldProduct.bulkCreate(orderedProducts)
      await Order.update({ totalPrice }, { where: { id: orderId } })
      const orderData = await SoldProduct.findAll({ where: { orderId }, raw: true })
      if (!orderData) throw new Error('送出失敗')
      res.status(200).json(orderData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = orderController
