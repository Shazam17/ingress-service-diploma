import { HttpException } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super('User not found', 403);
  }
}

export class PasswordIncorrect extends HttpException {
  constructor() {
    super('Password is incorrect', 403);
  }
}

export class UserIsAlreadyExists extends HttpException {
  constructor() {
    super('User is already exists', 403);
  }
}

export class InvalidToken extends HttpException {
  constructor() {
    super('Invalid token', 501);
  }
}
