'use strict';
import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/DB.config.js";

class Media extends Model {}

Media.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  file_type: {
    type: DataTypes.ENUM('audio', 'video', 'image', 'document'),
    allowNull: false
  },
  file_size: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING, 
    allowNull: true 
  },
  price: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Media',
  tableName: 'media',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
});

export default Media;
