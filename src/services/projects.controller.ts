import { Body, Controller, Post } from '@nestjs/common';
import { PostgresProjectsRepository } from '../packages/repositories/postgress/postgres-projects-repository';
import {
  CreateProjectInput,
  Usecase as CreateProjectUsecase,
} from '../packages/domain/projects/usecases/create-project';

@Controller()
export class ProjectsController {
  constructor(private projects: PostgresProjectsRepository) {}

  @Post('/create-project')
  public createProject(@Body() body: CreateProjectInput) {
    const usecase = new CreateProjectUsecase(this.projects);
    return usecase.execute(body);
  }
}
