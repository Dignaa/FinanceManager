import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
       host: process.env.DB_HOST,
       port: 5432,//+process.env.DB_PORT,
       username: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
    //    autoLoadEntities: true,
       synchronize: false, // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
       entities: [__dirname + '/**/*.entity{.ts,.js}'],
       migrations: ['dist/migrations/*{.ts,.js}'],
}

const datasource = new DataSource(dbConfig as DataSourceOptions);
export default datasource;