const { Op } = require('sequelize')
const { Order, DailyRevenue, SoldProduct, Product, sequelize } = require('../models')
const moment = require('moment')

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
        const customerNum = await Order.sum('adultNum', { where: { isPaid: true, isClosed: false } })
        const revenuePerCustomer = Math.floor(revenue / customerNum)
        const dailyRevenue = await DailyRevenue.create({ postingDate, revenue, customerNum, revenuePerCustomer })
        await Order.update({ isClosed: true }, {
          where: {
            isPaid: true,
            isClosed: false
          }
        })
        res.status(200).json(dailyRevenue)
      } else {
        const startDate = lastRevenue.createdAt
        const customerNum = await Order.sum('adultNum', {
          where: {
            isPaid: true,
            isClosed: false,
            createdAt: { [Op.gte]: startDate }
          }
        })
        const revenuePerCustomer = Number((revenue / customerNum).toFixed())
        const dailyRevenue = await DailyRevenue.create({ postingDate, revenue, customerNum, revenuePerCustomer })
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
  },
  // 取得月營收
  getRevenueByMonth: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query
      const sDate = moment(startDate).format('YYYY-MM-DD')
      const eDate = moment(endDate).format('YYYY-MM-DD')
      const data = await DailyRevenue.findAll({
        attributes: ['postingDate', 'revenue', 'customerNum', 'revenuePerCustomer'],
        where: {
          postingDate: {
            [Op.between]: [sDate, eDate]
          }
        },
        raw: true
      })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  // 取得銷售排行
  getSalesRank: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query
      const sDate = moment.utc(startDate, 'YYYY-MM-DD').add(8, 'hours').format()
      const eDate = moment.utc(endDate, 'YYYY-MM-DD').add(1, 'days').add(8, 'hours').format()
      const salesData = await SoldProduct.findAll({
        attributes: ['product_id', [sequelize.fn('SUM', sequelize.col('count')), 'counts']],
        where: {
          createdAt: {
            [Op.gte]: sDate,
            [Op.lt]: eDate
          }
        },
        include: {
          model: Product,
          attributes: ['name']
        },
        group: ['product_id'],
        order: [['counts', 'DESC']]
      })
      res.status(200).json(salesData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = revenueController
