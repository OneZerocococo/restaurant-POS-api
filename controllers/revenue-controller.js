const { Op } = require('sequelize')
const { Order, DailyRevenue } = require('../models')

const revenueController = {
  // 取得系統金額(尚未關帳的營收)
  getUnsettledRevenue: async (req, res, next) => {
    try {
      const lastRevenue = await DailyRevenue.findOne({
        order: [['createdAt', 'DESC']],
        raw: true
      })
      if (!lastRevenue) {
        const revenue = await Order.sum('totalPrice', {
          where: {
            isPaid: true,
            isClosed: false
          }
        })
        res.status(200).json({ UnsettledRevenue: revenue })
      } else {
        const startDate = lastRevenue.createdAt
        console.log(startDate)
        const revenue = await Order.sum('totalPrice', {
          where: {
            isPaid: true,
            isClosed: false,
            createdAt: {
              [Op.gte]: startDate
            }
          }
        })
        res.status(200).json({ UnsettledRevenue: revenue })
      }
    } catch (err) {
      next(err)
    }
  },
  // 關帳
  closeDailyRevenue: async (req, res, next) => {
    try {
      const lastRevenue = await DailyRevenue.findOne({
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const { postingDate, revenue } = req.body
      const isExisted = await DailyRevenue.findOne({ where: { postingDate } })
      if (isExisted) throw new Error('This postingDate has closed!')
      if (!lastRevenue) {
        const dailyRevenue = await DailyRevenue.create({ postingDate, revenue })
        await Order.update({ isClosed: true }, {
          where: {
            isPaid: true,
            isClosed: false
          }
        })
        res.status(200).json(dailyRevenue)
      } else {
        const dailyRevenue = await DailyRevenue.create({ postingDate, revenue })
        const startDate = lastRevenue.createdAt
        await Order.update({ isClosed: true }, {
          where: {
            isPaid: true,
            isClosed: false,
            createdAt: {
              [Op.gte]: startDate
            }
          }
        })
        res.status(200).json(dailyRevenue)
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = revenueController
