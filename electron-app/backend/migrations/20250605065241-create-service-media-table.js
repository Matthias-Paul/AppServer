'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('service_media', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    service_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      }
    },
    media_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id',
      }
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('service_media');
}
