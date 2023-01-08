'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SoldProduct extends Model {
    static associate (models) {
      SoldProduct.belongsTo(models.Order, { foreignKey: 'orderId' })
      SoldProduct.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  SoldProduct.init({
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Order',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id'
      },
      onUpdate: 'CASCADE'
    },
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SoldProduct',
    tableName: 'Sold_products',
    underscored: true
  })
  return SoldProduct
}
