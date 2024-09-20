'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasMany(models.BookBorrow, {
        foreignKey: 'bookCode', 
        targetKey: 'code', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
        sourceKey: 'code'
      })
    }
  }
  Book.init({
    code: {
      type: DataTypes.STRING,
      unique: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};