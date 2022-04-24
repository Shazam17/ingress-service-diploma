import {
  PostgresUsersRepository,
  UserModel,
} from '../../../repositories/postgress/postgres-users-repository.service';
import {
  PostgresProjectsRepository,
  ProjectRole,
} from '../../../repositories/postgress/postgres-projects-repository';
import { IsObject, IsString } from 'class-validator';
import {
  ProjectCreationFailed,
  UserNotFound,
} from '../../../shared/ErrorTypes';
import { RequestSuccess } from '../../../shared/ResponseTypes';

export class CreateProjectInput {
  @IsObject()
  user: UserModel;
  @IsString()
  projectName: string;
}

export class Usecase {
  private projects: PostgresProjectsRepository;

  constructor(projects: PostgresProjectsRepository) {
    this.projects = projects;
  }

  public async execute(input: CreateProjectInput) {
    if (!input.user) {
      throw new UserNotFound();
    }

    const project = await this.projects.createProject(input.projectName);

    if (!project) {
      throw new ProjectCreationFailed();
    }

    await this.projects.addProjectCollaborator(
      input.user.id,
      project.id,
      ProjectRole.ADMIN,
    );

    return new RequestSuccess({});
  }
}
