'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookBorrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookBorrow.belongsTo(models.Member, {foreignKey: 'memberCode', targetKey: 'code', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      BookBorrow.belongsTo(models.Book, {foreignKey: 'bookCode', targetKey: 'code', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    }
  }
  BookBorrow.init({
    memberCode: {
      type: DataTypes.STRING,
      references: {
          model: "Member",
          key: "code"
      }
    },
    bookCode: {
      type: DataTypes.STRING,
      references: {
          model: "Book",
          key: "code"
      }
    }
  }, {
    sequelize,
    modelName: 'BookBorrow',
  });
  return BookBorrow;
};