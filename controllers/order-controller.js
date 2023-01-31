const { Order, Table, SoldProduct, Product } = require('../models')

const orderController = {
  // 開桌設定人數
  setOrder: async (req, res, next) => {
    try {
      const tableId = req.params.table_id
      // 桌子不存在、狀態無效，不可開桌
      const table = await Table.findByPk(tableId)
      if (!table) throw new Error('桌號不存在')
      if (!table.isValid) throw new Error('無效桌號不可開桌')
      // 若已經開桌有單號未結帳，禁止再次開桌
      const isOrdered = await Order.findOne({ where: { tableId, isPaid: false } })
      if (isOrdered) throw new Error('該桌已有人')
      const { adultNum, childrenNum } = req.body
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
      const tableName = req.params.table_name
      const table = await Table.findOne({ where: { name: tableName }, raw: true })
      const order = await Order.findOne({
        where: {
          tableId: table.id,
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
  // 送出訂單
  SubmitOrder: async (req, res, next) => {
    try {
      const orderId = Number(req.params.order_id)
      const order = await Order.findByPk(orderId, { raw: true })
      if (!order) throw new Error('not found this order')
      // 禁止已結帳訂單被修改
      if (order.isPaid) throw new Error('This order is paid!')
      const orderData = req.body
      const updateData = orderData.map(od => ({ ...od, orderId }))
      const priceByProduct = updateData.map(p => p.count * p.sellingPrice)
      const totalPrice = priceByProduct.reduce((a, c) => a + c, 0)
      await SoldProduct.destroy({ where: { orderId } })
      await SoldProduct.bulkCreate(updateData)
      await Order.update({ totalPrice }, { where: { id: orderId } })
      const finalRecords = await SoldProduct.findAll({
        where: { orderId },
        attributes: {
          exclude: ['orderId', 'createdAt', 'updatedAt']
        },
        raw: true
      })
      const socketData = { orderId, tableId: order.tableId }
      io.emit('ordered', socketData)
      res.status(200).json({ orderId, totalPrice, finalRecords })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = orderController
