'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate (models) {
      Order.hasMany(models.SoldProduct)
      Order.belongsTo(models.Table, { foreignKey: 'tableId' })
    }
  }
  Order.init({
    tableId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Table',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
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
