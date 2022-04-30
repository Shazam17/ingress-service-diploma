import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresUsersRepository,
  UserModel,
} from './packages/repositories/postgress/postgres-users-repository.service';
import { AuthController } from './services/auth.controller';
import { ChatsController } from './services/chats.controller';
import { LoggerMiddleware } from './packages/shared/authorizer';
import { MailingService } from './packages/infrastructure/mailing/mailing-service';
import {
  PostgresProjectsRepository,
  ProjectModel,
  UserRoleModel,
} from './packages/repositories/postgress/postgres-projects-repository';
import { ProjectsController } from './services/projects.controller';
import {
  ChatModel,
  MessageModel,
  PostgresChatsRepository,
  UserChatModel,
} from './packages/repositories/postgress/postgres-chats-repository';
import { EventsController } from './services/events.controller';
import { WebSocketAdapter } from './packages/infrastructure/sockets/webSocketAdapter';

@Module({
  imports: [
    SequelizeModule.forRoot({
      username: 'admin',
      password: 'password',
      database: 'ingress_service',
      host: '127.0.0.1',
      dialect: 'postgres',
      models: [
        UserModel,
        UserRoleModel,
        ProjectModel,
        ChatModel,
        MessageModel,
        UserChatModel,
      ],
    }),
  ],
  controllers: [
    AuthController,
    ChatsController,
    ProjectsController,
    EventsController,
  ],
  providers: [
    PostgresUsersRepository,
    PostgresProjectsRepository,
    MailingService,
    PostgresChatsRepository,
    WebSocketAdapter,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ChatsController);
    consumer.apply(LoggerMiddleware).forRoutes(ChatsController);
  }
}
