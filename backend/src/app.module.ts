import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_DB_HOST || 'localhost',
      port: process.env.POSTGRESQL_DB_PORT
        ? parseInt(process.env.POSTGRESQL_DB_PORT, 10)
        : 5432,
      username: process.env.POSTGRESQL_DB_USERNAME,
      password: process.env.POSTGRESQL_DB_PASSWORD,
      database: process.env.POSTGRESQL_DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
