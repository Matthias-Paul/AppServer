import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/DB.config.js'
import User from './users.model.js'
import Media from './media.model.js'

class MediaPurchase extends Model {}

MediaPurchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    downloaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'MediaPurchase',
    tableName: 'media_purchases',
    timestamps: false
  }
)

Media.belongsToMany(User, { through: MediaPurchase, foreignKey: 'media_id', as: 'buyers' })
User.belongsToMany(Media, { through: MediaPurchase, foreignKey: 'user_id', as: 'purchases' })
MediaPurchase.belongsTo(Media, { foreignKey: 'media_id', as: 'media' })
MediaPurchase.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

export default MediaPurchase
