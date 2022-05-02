import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UserModel } from './postgres-users-repository.service';
import { v4 as uuidv4 } from 'uuid';

export const CHAT_FILTER = {
  ALL: 'ALL',
  TELEGRAM: 'TELEGRAM',
};

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
  integrationId: string;
  @Column
  createdAt: Date;
}

@Table({
  tableName: 'UserChats',
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

  async createUserChat(id: string, type: string, integrationId: string) {
    return ChatModel.create({
      id,
      type,
      chatName: `Chat with id: ${id}`,
      integrationId,
    });
  }

  async addUserToChat(userId: string, chatId: string) {
    const found = await UserChatModel.findOne({ where: { userId, chatId } });
    if (found) {
      return found;
    }
    return UserChatModel.create({ id: uuidv4(), userId, chatId });
  }

  async getUserChatsById(
    userId: string,
    offset = 0,
    limit = 10,
    channelFilter = CHAT_FILTER.ALL,
  ) {
    const foundUserChats = await UserChatModel.findAll({ where: { userId } });
    const filter =
      channelFilter === CHAT_FILTER.ALL ? {} : { type: channelFilter };
    const chats = await Promise.all(
      foundUserChats.map(async (item) => {
        return ChatModel.findOne({
          where: { id: item.chatId, ...filter },
          offset,
          limit,
        });
      }),
    );
    return chats;
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

  async getMessagesByChat(chatId: string, limit = 10, offset = 0) {
    return MessageModel.findAll({
      where: { chatId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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
    text: string,
  ) {
    return MessageModel.create({
      id,
      fromUser,
      toUser,
      chatId,
      attachmentUrl,
      text,
    });
  }
}
