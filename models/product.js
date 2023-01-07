'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate (models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.hasOne(models.Soldproduct, { foreignKey: 'productId' })
    }
  }
  Product.init({
    categoryId: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    nameEn: DataTypes.STRING,
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
