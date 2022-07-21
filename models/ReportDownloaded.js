const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ReportDownload = sequelize.define("reportDownload", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileURL: Sequelize.STRING,

});

module.exports = ReportDownload;
