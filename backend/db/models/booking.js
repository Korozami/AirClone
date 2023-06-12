'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.User,
        { foreignKey: 'userBooking' }
      );

      Booking.belongsTo (
        models.Spot,
        { foreignKey: 'spotBooking' }
      );
    }
  }
  Booking.init({
    userBooking: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotBooking: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
