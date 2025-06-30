'use strict'

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('media_purchases', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    media_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id'
      },
    },
    downloaded_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })

  // Ensure a user can't purchase the same media twice
  await queryInterface.addConstraint('media_purchases', {
    fields: ['user_id', 'media_id'],
    type: 'unique',
    name: 'unique_user_media_purchase'
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('media_purchases')
}
