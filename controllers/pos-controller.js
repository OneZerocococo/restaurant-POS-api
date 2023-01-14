const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Setting, SoldProduct, Order } = require('../models')

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
  // POS送出訂單
  posSubmitOrder: async (req, res, next) => {
    try {
      const tableId = Number(req.params.table_id)
      const orderId = Number(req.params.order_id)
      const updateData = req.body
      // 先算低消
      const settings = await Setting.findOne({ raw: true })
      // 取得大人均低消金額
      const minCharge = Number(settings.minCharge)
      const priceByProduct = updateData.map(p => p.count * p.sellingPrice)
      const totalPrice = priceByProduct.reduce((a, c) => a + c, 0)
      const order = await Order.findOne({ where: { tableId, id: orderId, isPaid: false } })
      if (totalPrice / Number(order.adultNum) < minCharge) throw new Error('未達低消!')
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
      res.status(200).json({ orderId, totalPrice, finalRecords })
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
  }
}

module.exports = posController
