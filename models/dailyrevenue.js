'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class DailyRevenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  DailyRevenue.init({
    postingDate: DataTypes.DATEONLY,
    revenue: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DailyRevenue',
    tableName: 'Daily_revenues',
    underscored: true
  })
  return DailyRevenue
}
