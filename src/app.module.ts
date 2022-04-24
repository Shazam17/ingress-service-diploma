import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresUsersRepository,
  UserModel,
} from './packages/repositories/postgress/postgres-users-repository.service';
import { AuthController } from './services/auth.controller';
import { PanelController } from './services/panel.controller';
import { LoggerMiddleware } from './packages/shared/authorizer';
import { MailingService } from './packages/infrastructure/mailing/mailing-service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      username: 'admin',
      password: 'password',
      database: 'ingress_service',
      host: '127.0.0.1',
      dialect: 'postgres',
      models: [UserModel],
    }),
  ],
  controllers: [AuthController, PanelController],
  providers: [PostgresUsersRepository, MailingService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PanelController);
  }
}
