import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWT, TOKEN_SECRET } from './jwt';
import { PostgresUsersRepository } from '../repositories/postgress/postgres-users-repository.service';
import { UserNotFound } from './ErrorTypes';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private users: PostgresUsersRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = JWT.verifyToken(req.header('token'), TOKEN_SECRET.ACCESS);
    const user = await this.users.getUserById(userId);
    if (!user) {
      throw new UserNotFound();
    }
    req.body.user = user;
    next();
  }
}
