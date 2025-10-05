export interface CreatedTaskResponse {
  message: string;
  data: CreatedTaskResponseData;
}

interface CreatedTaskResponseData {
  id: number | string;
}
