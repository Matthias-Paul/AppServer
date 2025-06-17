'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('transactions', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    media_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id'
      }
    },
    credits_used: {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false
    },
    transaction_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('transactions');
}
