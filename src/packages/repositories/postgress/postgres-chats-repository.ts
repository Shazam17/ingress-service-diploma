import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';

@Table({
  tableName: 'Chats',
})
export class ChatModel extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;
  @Column
  chatName: string;
  @Column
  type: string;
  @Column
  username: string;
  @Column
  createdAt: Date;
}

@Table({
  tableName: 'Chats',
})
export class UserChatModel extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;
  @IsUUID(4)
  @Column
  userId: string;
  @IsUUID(4)
  @Column
  chatId: string;
}

@Table({
  tableName: 'Chats',
})
export class MessageModel extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;
  @Column
  text: string;
  @IsUUID(4)
  @Column
  toUser: string;
  @IsUUID(4)
  @Column
  fromUser: string;
  @Column
  attachmentUrl: string;
  @Column
  chatId: string;
}

@Injectable()
export class PostgresChatsRepository {}
