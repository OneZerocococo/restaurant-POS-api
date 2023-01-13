const { Table, Order } = require('../models')

const tableController = {
  // 取得所有桌號
  getTables: async (req, res, next) => {
    try {
      const tables = await Table.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: ['id'],
        include: [
          {
            model: Order,
            attributes: ['id', 'totalPrice', 'isPaid', 'isFinished'],
            required: false,
            where: {
              isFinished: false
            }
          }
        ],
        raw: true,
        nest: true
      })
      res.status(200).json(tables)
    } catch (err) {
      next(err)
    }
  },
  // 編輯一張桌子
  editTable: async (req, res, next) => {
    try {
      const tableId = req.params.id
      const { name } = req.body
      if (!name.trim()) throw new Error('內容不可空白')
      const table = await Table.findByPk(tableId)
      if (!table) throw new Error('桌號不存在')
      const editedTable = await table.update({ name })
      const tableData = editedTable.toJSON()
      res.status(200).json(tableData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tableController
