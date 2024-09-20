'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.hasMany(models.BookBorrow, {
        foreignKey: 'memberCode', 
        targetKey: 'code',  
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE' ,
        sourceKey: 'code'
      })
    }
  }
  Member.init({
    code: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Code already registered'
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: "Code is required"
        },
        notEmpty: {
          msg: "Code is required"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "name is required"
        },
        notEmpty: {
          msg: "name is required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};