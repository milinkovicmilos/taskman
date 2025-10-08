import { Injectable } from '@angular/core';
import { TaskStorage } from '../interfaces/task-storage';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { TaskData, TaskDetailData } from '../interfaces/task-data';
import { CreateTaskData } from '../interfaces/create-task-data';
import { CreatedTaskResponse } from '../interfaces/created-task-response';
import { LocalSubtaskStorage } from '../../subtasks/services/local-subtask-storage';
import { GroupRole } from '../../groups/enums/group-role';
import { MessageResponse } from '../../../shared/interfaces/message-response';
import { UpdateTaskData } from '../interfaces/update-task-data';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskStorage implements TaskStorage {
  sortOption: number = 1;

  localStorageGet(): string | null {
    return localStorage.getItem("tasks");
  }

  localStorageSet(value: object | []): void {
    localStorage.setItem("tasks", JSON.stringify(value));
  }

  constructor() {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      localStorage.setItem("tasks", "{}");
    }
  }

  getTasks(projectId: number | string, page: number = 1): Observable<any> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of([]);
    }

    const data: TaskData[] = JSON.parse(tasksData)[projectId];
    if (data == null) {
      return of([]);
    }

    switch (Number(this.sortOption)) {
      case 1:
        data.sort((x, y) => {
          return new Date(y.created_at).getTime() - new Date(x.created_at).getTime();
        });
        break;

      case 2:
        data.sort((x, y) => {
          return new Date(x.created_at).getTime() - new Date(y.created_at).getTime();
        });
        break;

      case 3:
        data.sort((x, y) => {
          if (x.priority != null && y.priority == null) {
            return -1;
          }
          else if (x.priority == null && y.priority != null) {
            return 1;
          }
          else if (x.priority == null && y.priority == null) {
            return 0;
          }
          return y.priority! - x.priority!;
        });
        break;

      case 4:
        data.sort((x, y) => {
          if (x.priority != null && y.priority == null) {
            return 1;
          }
          else if (x.priority == null && y.priority != null) {
            return -1;
          }
          else if (x.priority == null && y.priority == null) {
            return 0;
          }
          return x.priority! - y.priority!;
        });
        break;
    }
    const perPage = 8;
    const offset = perPage * (page - 1);
    const response: PaginatedResponse<TaskData> = {
      current_page: page,
      per_page: perPage,
      total: data.length,
      last_page: data.length != 0 ? Math.ceil(data.length / perPage) : 1,
      data: data.splice(offset, perPage),
    }
    return of(response);
  }

  getTask(projectId: number | string, taskId: number | string): Observable<any> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasks = JSON.parse(tasksData);
    const projectsTasks: TaskDetailData[] = tasks[projectId];
    if (projectsTasks == null) {
      return of(null);
    }

    const task = projectsTasks.find(x => x.id === taskId);
    if (task == null) {
      return of(null);
    }

    task.role = GroupRole.Owner;
    task.editable = true;
    task.deletable = true;
    task.can_create_subtasks = true;
    return of(task);
  }

  storeTask(projectId: number | string, task: CreateTaskData): Observable<any> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasks = JSON.parse(tasksData);
    if (tasks[projectId] == null) {
      tasks[projectId] = [];
    }

    const now = new Date();
    const taskToStore: TaskData = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
      priority: task.priority ?? null,
      due_date: task.due_date ?? null,
      completed: false,
      completed_at: null,
      created_at: now.toISOString(),
    }
    tasks[projectId].push(taskToStore);

    this.localStorageSet(tasks);
    const data: CreatedTaskResponse = {
      message: 'Successfully created a task.',
      data: {
        id: taskToStore.id,
      }
    }
    return of(data);
  }

  updateTask(projectId: number | string, taskId: number | string, task: UpdateTaskData): Observable<any | null> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasksObj = JSON.parse(tasksData);
    if (tasksObj == null) {
      return of(null);
    }

    const projectsTasks: TaskData[] = tasksObj[projectId];
    if (projectsTasks == null) {
      return of(null);
    }

    projectsTasks.map(x => {
      if (x.id === taskId) {
        x.title = task.title;
        x.description = task.description;
        x.priority = task.priority ?? null;
        x.due_date = task.due_date ?? null;
      }
    });
    this.localStorageSet(tasksObj);
    const response: MessageResponse = {
      message: 'Successfully updated the task.'
    };
    return of(response);
  }

  removeTask(projectId: number | string, taskId: number | string): Observable<any | null> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasksObj = JSON.parse(tasksData);
    if (tasksObj == null) {
      return of(null);
    }

    const projectsTasks: TaskData[] = tasksObj[projectId];
    if (projectsTasks == null) {
      return of(null);
    }

    const tasks = projectsTasks.filter(x => x.id != taskId);
    tasksObj[projectId] = tasks;

    const subtaskStorage = new LocalSubtaskStorage();
    subtaskStorage.removeSubtasks(taskId);

    this.localStorageSet(tasksObj);
    const response: MessageResponse = {
      message: 'Successfully deleted the task.',
    };
    return of(response);
  }

  markTaskComplete(projectId: number | string, taskId: number | string): Observable<any | null> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasksObj = JSON.parse(tasksData);
    if (tasksObj[projectId] == null) {
      return of(null);
    }

    const projectsTasks: TaskData[] = tasksObj[projectId];
    if (projectsTasks == null) {
      return of(null);
    }

    const now = new Date();
    projectsTasks.map(x => {
      if (x.id === taskId) {
        x.completed = true;
        x.completed_at = now.toISOString().split('T')[0];
      }
    });

    this.localStorageSet(tasksObj);
    const response: MessageResponse = {
      message: 'Successfully marked task as complete.'
    };
    return of(response);
  }

  markTaskIncomplete(projectId: number | string, taskId: number | string): Observable<any | null> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasksObj = JSON.parse(tasksData);
    if (tasksObj[projectId] == null) {
      return of(null);
    }

    const projectsTasks: TaskData[] = tasksObj[projectId];
    if (projectsTasks == null) {
      return of(null);
    }

    projectsTasks.map(x => {
      if (x.id === taskId) {
        x.completed = false;
        x.completed_at = null;
      }
    });

    this.localStorageSet(tasksObj);
    const response: MessageResponse = {
      message: 'Successfully marked task as incomplete.'
    };
    return of(response);
  }

  removeTasks(projectId: number | string): void {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return;
    }

    let tasks: Record<string, TaskData> = JSON.parse(tasksData);
    if (tasks[projectId] == null) {
      return;
    }

    delete tasks[projectId];
    this.localStorageSet(tasks);
  }
}
