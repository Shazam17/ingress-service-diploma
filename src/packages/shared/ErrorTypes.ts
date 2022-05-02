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

export class UserEmailNotVerified extends HttpException {
  constructor() {
    super("User's email isn't verified", 403);
  }
}

export class InvalidToken extends HttpException {
  constructor() {
    super('Invalid token', 501);
  }
}

export class ProjectCreationFailed extends HttpException {
  constructor() {
    super('Project create failed', 500);
  }
}

export class ChatNotFound extends HttpException {
  constructor() {
    super('Chat not found', 404);
  }
}
