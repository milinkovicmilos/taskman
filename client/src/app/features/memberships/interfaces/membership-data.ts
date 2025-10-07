import { GroupRole } from "../../groups/enums/group-role";

export interface MembershipData {
  id: number | string;
  user_id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: GroupRole;
}
