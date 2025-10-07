export interface GroupDetailData {
  id: number | string;
  name: string;
  owner: string;
  deletable: boolean;
  editable: boolean;
  can_invite_to_group: boolean;
  can_create_projects: boolean;
}
