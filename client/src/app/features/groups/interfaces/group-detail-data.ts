export interface GroupDetailData {
  id: number | string;
  name: string;
  owner: string;
  members: string[];
  member_count: number;
  deletable: boolean;
  editable: boolean;
  can_invite_to_group: boolean;
  can_create_projects: boolean;
}
