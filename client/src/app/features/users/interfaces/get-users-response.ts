import { UserDetailData } from "./user-detail-data";

export interface GetUsersResponse {
  message: string;
  data: UserDetailData[];
}
