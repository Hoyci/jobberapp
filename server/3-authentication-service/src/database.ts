import { winstonLogger } from '@hoyci/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize(`${config.MYSQL_DB}`, {
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true
  },
  logging: false
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService MySQL database connection has been established');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database');
    log.log('error', 'AuthSerivce databaseConnection() method error:', error);
  }
}
