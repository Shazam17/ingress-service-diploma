import { UserRepository } from '../../domain/auth/repositories/UsersRepository';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserNotFound } from '../../shared/ErrorTypes';

@Table({
  tableName: 'Users',
})
export class UserModel extends Model {
  @PrimaryKey
  @Column
  id: string;
  @Column
  username: string;
  @Column
  email: string;
  @Column
  salt: string;
  @Column
  hash: string;
  @Column
  verified: boolean;
}

@Injectable()
export class PostgresUsersRepository implements UserRepository {
  async getUserById(id: string): Promise<UserModel> {
    return UserModel.findOne({ where: { id: { [Op.eq]: id } } });
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    return await UserModel.findOne({
      where: { email: { [Op.eq]: email } },
    });
  }

  async createUser(
    username: string,
    email: string,
    salt: string,
    hash: string,
  ): Promise<UserModel> {
    return UserModel.create({
      username,
      email,
      salt,
      hash,
      id: uuidv4(),
      verified: false,
    });
  }

  async setUserEmailVerified(id: string) {
    const user = await UserModel.findOne({ where: { id: { [Op.eq]: id } } });
    if (!user) {
      throw new UserNotFound();
    }
    user.verified = true;
    await user.save();
  }
}
