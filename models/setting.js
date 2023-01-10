'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate (models) {
    }
  }
  Setting.init({
    minCharge: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Setting',
    tableName: 'Settings',
    underscored: true
  })
  return Setting
}
