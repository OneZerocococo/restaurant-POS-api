'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate (models) {
      Table.hasMany(models.Order, { foreignKey: 'tableId' })
    }
  }
  Table.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Table',
    tableName: 'Tables',
    underscored: true
  })
  return Table
}
