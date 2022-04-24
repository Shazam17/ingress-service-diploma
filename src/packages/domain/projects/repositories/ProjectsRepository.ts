export interface ProjectsRepository {
  createProject(name: string);
  addProjectCollaborator(userId: string, projectId: string, role: any);
}
