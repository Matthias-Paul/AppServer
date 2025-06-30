import { Sequelize } from 'sequelize'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '..', 'data-storage', 'db.sqlite'),
  logging: false


})


// const deleteTable = async () => {
//   try {
//     await sequelize.getQueryInterface().dropTable('media')
//     console.log('media table deleted successfully.')
//   } catch (err) {
//     console.error('Failed to delete table:', err)
//   }
// }

// deleteTable()



export const testDbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
