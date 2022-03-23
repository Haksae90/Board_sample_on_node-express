'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Users, { foreignKey: 'userId', sourceKey: 'userId' });
      Comments.belongsTo(models.Articles, { foreignKey: 'articleId', sourceKey: 'articleId', onDelete: 'CASCADE' });
    }
  }
  Comments.init({
    commentId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      required: true,
    },
    comment: {
      type: Sequelize.STRING,
      required: true,
    }
  }, {
    sequelize,
    modelName: 'Comments',
    timestamps: true,
  });
  return Comments;
};