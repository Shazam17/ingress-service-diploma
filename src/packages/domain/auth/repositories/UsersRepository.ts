import { UserModel } from '../../../repositories/postgress/postgres-users-repository.service';

export interface UserRepository {
  getUserById(id: string): Promise<UserModel>;
  getUserByEmail(email: string): Promise<UserModel>;
  setUserEmailVerified(id: string);
  createUser(
    username: string,
    email: string,
    salt: string,
    hash: string,
  ): Promise<UserModel>;
}
