import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/DB.config.js'
import User from './users.model.js'

class UserActivity extends Model {}

UserActivity.init(
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
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'user_activities',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
)

UserActivity.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
User.hasMany(UserActivity, { foreignKey: 'user_id', as: 'activities' })

export default UserActivity



