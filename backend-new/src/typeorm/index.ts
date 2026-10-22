import { DataSource, DataSourceOptions } from 'typeorm';

const options = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
} satisfies DataSourceOptions;

export const AppDataSource: DataSource = new DataSource(options);
