import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/DB.config.js'
import User from './users.model.js'

class CreditAllocation extends Model {}

CreditAllocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    credits_added: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    generatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CreditAllocation',
    tableName: 'credit_allocations',
    timestamps: false,
    underscored: true,
  }
)

CreditAllocation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'allocatedTo',
})

CreditAllocation.belongsTo(User, {
  foreignKey: 'generatedBy',
  as: 'allocatedBy',
})



export default CreditAllocation
