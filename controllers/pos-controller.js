const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Setting, Order, SoldProduct, Product, Table } = require('../models')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { Op } = require('sequelize')

dayjs.extend(utc)
dayjs.extend(timezone)

const posController = {
  // 登入POS系統
  login: async (req, res, next) => {
    try {
      // check account and password
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '帳號不存在' })
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
      // sign token
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ token, user: userData })
    } catch (err) {
      next(err)
    }
  },
  // 取得基本設定
  getSettings: async (req, res, next) => {
    try {
      const settings = await Setting.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true
      })
      res.status(200).json(settings)
    } catch (err) {
      next(err)
    }
  },
  // 編輯基本設定
  editSettings: async (req, res, next) => {
    try {
      const { minCharge, description } = req.body
      const settings = await Setting.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true
      })
      const newSettings = await Setting.findByPk(settings.id)
      const newSettingsData = await newSettings.update({ minCharge, description })
      res.status(200).json(newSettingsData)
    } catch (err) {
      next(err)
    }
  },
  // 結帳
  payOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      const order = await Order.findByPk(orderId)
      if (!order) throw new Error('not found this order')
      if (order.isPaid === true) throw new Error('This order already paid!')
      // 先算低消
      // 取得大人均低消金額
      const settings = await Setting.findOne({ raw: true })
      const minCharge = Number(settings.minCharge)
      if (order.totalPrice / Number(order.adultNum) < minCharge) throw new Error('未達低消!')
      const isPaid = await order.update({ isPaid: true })
      if (!isPaid) throw new Error('paid fail')
      const finalOrder = await Order.findByPk(orderId, { attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
      res.status(200).json(finalOrder)
    } catch (err) {
      next(err)
    }
  },
  // 完成訂單
  finishOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      const order = await Order.findByPk(orderId)
      if (!order) throw new Error('not found this order')
      if (order.isFinished === true) throw new Error('This order already finished!')
      if (order.isPaid === false) throw new Error('This order should be paid!')
      const isFinished = await order.update({ isFinished: true })
      if (!isFinished) throw new Error('finish order fail')
      const finalOrder = await Order.findByPk(orderId, { attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
      res.status(200).json(finalOrder)
    } catch (err) {
      next(err)
    }
  },
  // POS取得單張訂單
  getOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      const order = await Order.findByPk(orderId, {
        attributes: ['id', 'tableId', 'adultNum', 'childrenNum', 'totalPrice', 'createdAt'],
        include: [{ model: Table, attributes: ['name'] }],
        raw: true,
        nest: true
      })
      if (!order) throw new Error('not found this order')
      const soldProducts = await SoldProduct.findAll({
        where: { orderId },
        attributes: ['productId', 'count', 'sellingPrice'],
        include: [{ model: Product, attributes: ['name'] }],
        raw: true,
        nest: true
      })
      order.createdAt = dayjs.utc(order.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
      order.soldProducts = soldProducts
      res.status(200).json(order)
    } catch (err) {
      next(err)
    }
  },
  // POS取得所有訂單
  getOrders: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = 10
      const offset = (page - 1) * limit
      const date = req.params.date
      const sDate = dayjs.utc(date, 'YYYY-MM-DD').subtract(8, 'hours').format()
      const eDate = dayjs.utc(date, 'YYYY-MM-DD').add(16, 'hours').format()
      const orders = await Order.findAll({
        where: {
          createdAt: {
            [Op.gte]: sDate,
            [Op.lt]: eDate
          }
        },
        attributes: ['id', 'adultNum', 'childrenNum', 'totalPrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true
      })
      orders.forEach(order => {
        order.createdAt = dayjs.utc(order.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
      })
      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = posController
