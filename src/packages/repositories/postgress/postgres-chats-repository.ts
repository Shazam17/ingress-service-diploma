import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UserModel } from './postgres-users-repository.service';

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
  tableName: 'Messages',
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
export class PostgresChatsRepository {
  async getChatById(id: string) {
    return ChatModel.findOne({ where: { id } });
  }

  async createUserChat(id: string, type: string) {
    return ChatModel.create({ id, type, chatName: `Chat with id: ${id}` });
  }

  async isUserInChat(userId: string, chatId: string) {
    const userChat = await UserChatModel.findOne({ where: { userId, chatId } });
    return !!userChat;
  }

  async insertNewMessage({
    id,
    text,
    toUser,
    fromUser,
    attachmentUrl,
    chatId,
  }: MessageModel) {
    return MessageModel.create({
      id,
      text,
      toUser,
      fromUser,
      attachmentUrl,
      chatId,
    });
  }

  async insertNewChat() {}

  async getUserChats(userId: string) {
    const userRoles = await UserChatModel.findAll({
      where: { userId: { [Op.eq]: userId } },
    });
    const chats = await Promise.all(
      userRoles.map(async (item: UserChatModel) =>
        UserModel.findOne({
          where: { id: { [Op.eq]: item.chatId } },
        }),
      ),
    );
    return chats;
  }

  createMessage(
    id: string,
    fromUser: string,
    toUser: string,
    chatId: string,
    attachmentUrl: string,
    text: string
  ) {
    return MessageModel.create({ id, fromUser, toUser, chatId, attachmentUrl,text });
  }
}
