'use strict'
import { Sequelize, DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/DB.config.js'
import Service from './service.model.js'
import Media from './media.model.js'

class ServiceMedia extends Model {}

ServiceMedia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'ServiceMedia',
    tableName: 'service_media',
    underscored: true,
    timestamps: false
  }
)

Service.belongsToMany(Media, {
  through: ServiceMedia,
  foreignKey: 'service_id',
  otherKey: 'media_id',
  as: 'media_files'
})

Media.belongsToMany(Service, {
  through: ServiceMedia,
  foreignKey: 'media_id',
  otherKey: 'service_id',
  as: 'services'
})

export default ServiceMedia
