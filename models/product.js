'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate (models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.hasOne(models.SoldProduct, { onDelete: 'SET DEFAULT', onUpdate: 'CASCADE' })
    }
  }
  Product.init({
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
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
