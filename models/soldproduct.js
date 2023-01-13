'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SoldProduct extends Model {
    static associate (models) {
      SoldProduct.belongsTo(models.Order, { foreignKey: 'orderId' })
      SoldProduct.belongsTo(models.Product, {
        foreignKey: 'productId',
        onUpdate: 'CASCADE'
      })
    }
  }
  SoldProduct.init({
    orderId: {
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER
    },
    count: DataTypes.INTEGER,
    sellingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SoldProduct',
    tableName: 'Sold_products',
    underscored: true
  })
  return SoldProduct
}
