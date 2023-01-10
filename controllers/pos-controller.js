const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Table } = require('../models')

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
  // POS取得所有桌號
  getTables: async (req, res, next) => {
    try {
      const tables = await Table.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true
      })
      res.status(200).json(tables)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = posController
