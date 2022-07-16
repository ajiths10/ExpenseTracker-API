const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userUuId: Sequelize.STRING,
  isActive: Sequelize.INTEGER,
});

module.exports = ForgotPassword;
