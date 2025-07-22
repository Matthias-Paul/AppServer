
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Media', 'file_source', {
    type: Sequelize.STRING,
    allowNull: false,
  })
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Media', 'file_source')
}
