'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate (models) {
      Order.hasMany(models.SoldProduct, { foreignKey: 'orderId' })
      Order.belongsTo(models.Table, {
        foreignKey: 'tableId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }
  Order.init({
    tableId: {
      type: DataTypes.INTEGER
    },
    adultNum: DataTypes.INTEGER,
    childrenNum: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
