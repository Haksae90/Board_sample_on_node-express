'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Articles, {
        foreignKey: 'userId',
        sourceKey: 'userId',
      });
      Users.hasMany(models.Comments, {
        foreignKey: 'userId',
        sourceKey: 'userId',
      });
    }
  }
  Users.init(
    {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      nickname: {
        type: Sequelize.STRING,
        require: false,
      },
      password: {
        type: Sequelize.STRING,
        require: false,
      },
    },
    {
      sequelize,
      modelName: 'Users',
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );
  return Users;
};
