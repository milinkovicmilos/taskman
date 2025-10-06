export interface TaskData {
  id: number | string;
  title: string;
  description: string;
  priority: number | null;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
}

export interface TaskDetailData extends TaskData {
  role: number | string;
}
