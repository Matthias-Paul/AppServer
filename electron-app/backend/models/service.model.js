'use strict';
import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/DB.config.js";

class Service extends Model {}

Service.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  theme: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  banner_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN, 
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Service',
  tableName: 'services',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
});

export default Service;


