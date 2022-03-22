'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Articles.belongsTo(models.Users, { foreignKey: 'userId', sourceKey: 'userId' });
      Articles.hasMany(models.Comments, { foreignKey: 'articleId', sourceKey: 'articleId' });
    }
  }
  Articles.init({
    articleId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      required: true,
    },
    title: {
      type: Sequelize.STRING,
      required: true,
    },
    content: {
      type: Sequelize.STRING,
      required: true,
    }
  }, {
    sequelize,
    modelName: 'Articles',
    timestamps: true,
  });
  return Articles;
};