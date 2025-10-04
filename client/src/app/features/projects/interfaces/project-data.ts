import { ProjectRole } from "../enums/project-role";

export interface ProjectData {
  id: number | string;
  name: string;
  description: string;
}

export interface ProjectDetailData extends ProjectData {
  role: ProjectRole;
}
