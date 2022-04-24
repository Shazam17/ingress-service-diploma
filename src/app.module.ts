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
import {
  PostgresProjectsRepository,
  ProjectModel,
  UserRoleModel,
} from './packages/repositories/postgress/postgres-projects-repository';
import { ProjectsController } from './services/projects.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      username: 'admin',
      password: 'password',
      database: 'ingress_service',
      host: '127.0.0.1',
      dialect: 'postgres',
      models: [UserModel, UserRoleModel, ProjectModel],
    }),
  ],
  controllers: [AuthController, PanelController, ProjectsController],
  providers: [
    PostgresUsersRepository,
    PostgresProjectsRepository,
    MailingService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ProjectsController);
  }
}
