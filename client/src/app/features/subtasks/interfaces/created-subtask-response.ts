export interface CreatedSubtaskResponse {
  message: string;
  data: CreatedSubtaskResponseData;
}

interface CreatedSubtaskResponseData {
  id: number | string;
}
