'use strict'
import { Sequelize, DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/DB.config.js'
import User from './users.model.js'
import Media from './media.model.js'

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Media',
        key: 'id'
      }
    },
    credits_used: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    underscored: true,
    timestamps: false
  }
)

// Associations
Transaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

Transaction.belongsTo(Media, {
  foreignKey: 'media_id',
  as: 'media'
})

User.hasMany(Transaction, {
  foreignKey: 'user_id',
  as: 'transactions'
})

Media.hasMany(Transaction, {
  foreignKey: 'media_id',
  as: 'media_transactions'
})

export default Transaction
