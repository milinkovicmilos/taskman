export interface CreatedGroupResponse {
  message: string;
  data: CreatedGroupResponseData;
}

interface CreatedGroupResponseData {
  id: number | string;
}
