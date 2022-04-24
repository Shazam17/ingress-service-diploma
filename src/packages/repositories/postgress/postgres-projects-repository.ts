import { ProjectsRepository } from '../../domain/projects/repositories/ProjectsRepository';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum ProjectRole {
  ADMIN = 'ADMIN',
}

@Table({
  tableName: 'UserRoles',
})
export class UserRoleModel extends Model {
  @PrimaryKey
  @Column
  id: string;
  @Column
  userId: string;
  @Column
  projectId: string;
  @Column
  role: string;
}

@Table({
  tableName: 'Projects',
})
export class ProjectModel extends Model {
  @PrimaryKey
  @Column
  id: string;
  @Column
  projectName: string;
}

@Injectable()
export class PostgresProjectsRepository implements ProjectsRepository {
  public async createProject(name: string): Promise<ProjectModel> {
    return ProjectModel.create({ id: uuidv4(), projectName: name });
  }
  public async addProjectCollaborator(
    userId: string,
    projectId: string,
    role: ProjectRole,
  ) {
    await UserRoleModel.create({
      id: uuidv4(),
      userId,
      projectId,
      role,
    });
  }
}
