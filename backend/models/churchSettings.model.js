
'use strict'
import { Sequelize, DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/DB.config.js'

class ChurchSetting extends Model {}

ChurchSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    church_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    church_logo_file_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    church_banner_file_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    church_banner_file_type: {
      type: DataTypes.ENUM('image'),
      allowNull: true
    },
    church_logo_file_type: {
      type: DataTypes.ENUM('image'),
      allowNull: true
    },
    is_updated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'ChurchSetting',
    tableName: 'church_setting',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

export default ChurchSetting


