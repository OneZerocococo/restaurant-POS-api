const { Order, Table } = require('../models')

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
  }
}

module.exports = orderController
