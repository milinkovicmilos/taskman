import { GroupRole } from '../../groups/enums/group-role';

export interface ProjectData {
  id: number | string;
  name: string;
  description: string;
}

export interface ProjectDetailData extends ProjectData {
  group_name: string | null;
  role: GroupRole;
  can_create_tasks: boolean;
}
