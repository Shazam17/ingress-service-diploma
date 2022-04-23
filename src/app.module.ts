import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresUsersRepository,
  UserModel,
} from './packages/repositories/postgress/postgres-users-repository.service';
import { AuthController } from './services/auth.controller';

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
  controllers: [AuthController],
  providers: [PostgresUsersRepository],
})
export class AppModule {}
