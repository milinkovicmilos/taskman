import { GroupRole } from "../../groups/enums/group-role";

export interface CreateMembershipData {
  user_id: number | string;
  role_id: GroupRole;
}
