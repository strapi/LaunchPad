const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

/**
 * https://sequelize.org/
 * https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
 */
class BaseModel extends Model {
  static init(attributes = {}, options = {}) {
    // console.log(arguments);
    // 定义公共字段
    const commonFields = {
      create_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Create Time'
      },
      update_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Update Time'
      },
      delete_time: {
        type: DataTypes.DATE,
        comment: 'Delete Time'
      },
    };

    // 合并公共字段和特定字段
    const mergedAttributes = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ...attributes,
      ...commonFields
    };

    // 设置默认配置
    const defaultOptions = {
      timestamps: false,
      ...options
    };
    // console.log(mergedAttributes, defaultOptions);
    super.init(mergedAttributes, defaultOptions);
  }
}

module.exports = exports = BaseModel;