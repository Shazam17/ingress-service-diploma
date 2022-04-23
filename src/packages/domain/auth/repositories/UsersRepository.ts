import { UserModel } from '../../../repositories/postgress/postgres-users-repository.service';

export interface UserRepository {
  getUserByEmail(email: string): Promise<UserModel>;
  createUser(
    username: string,
    email: string,
    salt: string,
    hash: string,
  ): Promise<void>;
}
