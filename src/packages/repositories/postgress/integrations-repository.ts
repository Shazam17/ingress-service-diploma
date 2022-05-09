import { Injectable } from '@nestjs/common';
import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export enum TELEGRAM_STATE {
  NOT_INITIALIZED = 'TELEGRAM_NOT_INITIALIZED',
  NEED_CODE = 'TELEGRAM_NEED_CODE',
  NEED_PASSWORD = 'TELEGRAM_NEED_PASSWORD',
  WORKING = 'TELEGRAM_WORKING',
  FAILED = 'TELEGRAM_FAILED',
}

@Table({
  tableName: 'Integrations',
})
export class Integration extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;
  @Column
  name: string;
  @Column
  state: string;
  @Column
  type: string;
  @Column
  userId: string;
  @Column
  createdAt: Date;
  @Column
  instanceId: string;

  createIntegration(url, userId) {
    return axios.post(url + '/new-instance', {
      userId,
    });
  }

  pushAuth(url, state, instanceId, value) {
    return axios.post(url + '/push-auth', {
      instanceId,
      state,
      value,
    });
  }

  async getState(url, instanceId: string) {
    return axios.post(url + '/get-state', {
      instanceId,
    });
  }

  async sendMessage(url, instanceId: string, message: string, chatId: string) {
    return axios.post(url + '/send-message', {
      instanceId,
      message,
      chatId,
    });
  }
}

@Table({
  tableName: 'IntegrationTypes',
})
export class IntegrationType extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;
  @Column
  name: string;
  @Column
  url: string;
}

@Injectable()
export class IntegrationsRepository {
  private integrationTypes: Promise<IntegrationType[]>;

  constructor() {
    this.integrationTypes = IntegrationType.findAll();
  }

  getIntegration(userId: string, instanceId: string) {
    return Integration.findOne({ where: { userId, instanceId } });
  }

  getUsersIntegrations(userId: string) {
    return Integration.findAll({ where: { userId } });
  }

  async createIntegration(
    userId: string,
    type: string,
    name = 'New integration',
  ) {
    const integrationType = await IntegrationType.findOne({
      where: { name: type },
    });

    const integration = await Integration.create({
      id: uuidv4(),
      userId,
      type,
      name,
      state: '',
      instanceId: '',
    });

    const response = await integration.createIntegration(
      integrationType.url,
      userId,
    );

    integration.instanceId = response.data.instanceId;
    const stateResponse = await integration.getState(
      integrationType.url,
      integration.instanceId,
    );
    integration.state = stateResponse.data.state.replace('TELEGRAM_', '');
    await integration.save();
    return { instanceId: integration.id };
  }

  async pushAuthState(integrationId: string, value: string) {
    const integration = await Integration.findOne({
      where: { id: integrationId },
    });
    const integrationType = await IntegrationType.findOne({
      where: { name: integration.type },
    });

    const response = await integration.pushAuth(
      integrationType.url,
      `${integrationType.name}_${integration.state}`,
      integration.instanceId,
      value,
    );
    const stateResponse = await integration.getState(
      integrationType.url,
      integration.instanceId,
    );
    integration.state = stateResponse.data.state.replace('TELEGRAM_', '');
    await integration.save();
    return { success: true };
  }

  transformStateToCommands(state: string) {
    switch (state) {
      case TELEGRAM_STATE.NOT_INITIALIZED:
        return {
          fieldName: 'phonenumber',
          canCommit: false,
        };
        break;
      case TELEGRAM_STATE.NEED_CODE:
        return {
          fieldName: 'authcode',
          canCommit: false,
        };
        break;
      case TELEGRAM_STATE.WORKING:
        return {
          fieldName: null,
          canCommit: true,
        };
        break;
      default:
        return;
        break;
    }
  }

  async canCommitCreate(integrationId: string) {
    const integration = await Integration.findOne({
      where: { id: integrationId },
    });
    const integrationType = await IntegrationType.findOne({
      where: { name: integration.type },
    });

    const response = await integration.getState(
      integrationType.url,
      integration.instanceId,
    );
    return this.transformStateToCommands(response.data.state);
  }

  async commitIntegrationCreate(integrationId: string) {
    const canCommit = await this.canCommitCreate(integrationId);
    if (!canCommit.canCommit) {
      console.log('Cant commit creation');
      return;
    }
    const integration = await Integration.findOne({
      where: { id: integrationId },
    });
    integration.state = 'WORKING';
    await integration.save();
  }

  async sendMessage(integrationId: string, message: string, chatId: string) {
    const integration = await Integration.findOne({
      where: { id: integrationId },
    });
    const integrationType = await IntegrationType.findOne({
      where: { name: integration.type },
    });
    await integration.sendMessage(
      integrationType.url,
      integration.instanceId,
      message,
      chatId,
    );
    return {};
  }
}
