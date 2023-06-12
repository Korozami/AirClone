'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImages.belongsTo(
        models.Spot,
        { foreignKey: 'spot_id' }
      );
      SpotImages.belongsTo(
        models.Spot,
        { foreignKey: 'preview' }
      );
    }
  }
  SpotImages.init({
    spot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    preview: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SpotImages',
  });
  return SpotImages;
};
