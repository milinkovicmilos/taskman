import { GroupRole } from '../../groups/enums/group-role';

export interface ProjectData {
  id: number | string;
  name: string;
  description: string;
}

export interface ProjectDetailData extends ProjectData {
  role: GroupRole;
}
