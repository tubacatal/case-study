import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL || "./database.db";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DATABASE_URL,
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the SQLite database has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database tables are synced successfully.');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

