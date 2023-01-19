'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate (models) {
      Table.hasMany(models.Order, { foreignKey: 'tableId' })
      Table.beforeCreate(async (instance, options) => {
        // 檢查 name 欄位是否已存在
        const existingInstance = await Table.findOne({
          where: {
            name: instance.name
          }
        })

        if (existingInstance) {
          throw new Error('Name already exists')
        }
      })

      Table.beforeUpdate(async (instance, options) => {
        // 檢查 name 欄位是否已存在
        const existingInstance = await Table.findOne({
          where: {
            name: instance.name
          }
        })

        if (existingInstance && existingInstance.id !== instance.id) {
          throw new Error('Name already exists')
        }
      })
    }
  }
  Table.init({
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Table',
    tableName: 'Tables',
    underscored: true
  })
  return Table
}
