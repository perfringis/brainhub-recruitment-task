import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/Event';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { EventRepository } from './repository/event.repository';

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
      entities: [Event],
    }),
  ],
  controllers: [EventController],
  providers: [
    // repository
    EventRepository,

    // service
    EventService,
  ],
})
export class AppModule {}
