'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate (models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
      Product.hasOne(models.SoldProduct, {
        foreignKey: 'productId',
        onDelete: 'SET DEFAULT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Product.init({
    categoryId: DataTypes.INTEGER,
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    nameEn: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    price: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  })
  return Product
}
