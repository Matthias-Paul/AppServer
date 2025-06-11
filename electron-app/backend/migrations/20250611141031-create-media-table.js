'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('media', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    file_path: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    file_type: {
      type: Sequelize.ENUM('audio', 'video', 'image', 'document'),
      allowNull: false,
    },
    file_size: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
     duration: {
        type: Sequelize.STRING, 
        allowNull: true
      },
    price: {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('media');
}
