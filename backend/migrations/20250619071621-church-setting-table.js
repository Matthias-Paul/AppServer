'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('church_setting', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    church_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    church_logo_file_path: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    church_banner_file_path: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    church_banner_file_type: {
      type: Sequelize.ENUM('image'),
      allowNull: true,
    },
    church_logo_file_type: {
      type: Sequelize.ENUM('image'),
      allowNull: true,
    },
    isUpdated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('church_setting');
}
