const sequelize = require('./index.js');
const { Model, DataTypes } = require("sequelize");

class PlatformTable extends Model { }

const fields = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'Platform ID'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Platform Name'
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Logo URL'
  },
  source_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'system',
    comment: 'Source Type'
  },
  api_key: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'API Key'
  },
  api_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'API URL'
  },
  api_version: {
    type: DataTypes.STRING(50),
    comment: 'API Version'
  },
  key_obtain_url: {
    type: DataTypes.STRING(255),
    comment: 'Key Obtain URL'
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Enabled'
  },
  is_subscribe: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'is subscribe'
  },
  create_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Created At'
  },
  update_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Updated At'
  }
};

PlatformTable.init(fields, {
  sequelize,
  modelName: 'platform'
});

module.exports = exports = PlatformTable;