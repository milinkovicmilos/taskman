export interface CreatedProjectResponse {
  message: string;
  data: CreatedProjectResponseData;
}

interface CreatedProjectResponseData {
  id: string | number;
}
