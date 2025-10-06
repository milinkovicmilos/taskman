import { Component, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { TASK_STORAGE } from '../../interfaces/task-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerTaskStorage } from '../../services/server-task-storage';
import { LocalTaskStorage } from '../../services/local-task-storage';
import { TaskData, TaskDetailData } from '../../interfaces/task-data';
import { Modal as ModalService } from '../../../../shared/services/modal';
import { Modal } from '../../../../shared/components/modal/modal';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { HeaderButton } from '../../../../shared/services/header-button';
import { SUBTASK_STORAGE } from '../../../subtasks/interfaces/subtask-storage';
import { ServerSubtaskStorage } from '../../../subtasks/services/server-subtask-storage';
import { LocalSubtaskStorage } from '../../../subtasks/services/local-subtask-storage';
import { SubtaskData } from '../../../subtasks/interfaces/subtask-data';
import { SubtaskCard } from '../../../subtasks/components/subtask-card/subtask-card';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { GroupRole } from '../../../groups/enums/group-role';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { UpdateTaskForm } from '../update-task-form/update-task-form';
import { CreateSubtaskForm } from '../../../subtasks/components/create-subtask-form/create-subtask-form';

@Component({
  selector: 'app-task-detail',
  imports: [Modal, Button, SubtaskCard, PageNavigation, UpdateTaskForm, CreateSubtaskForm],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
  providers: [
    {
      provide: TASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerTaskStorage() : new LocalTaskStorage();
      }),
    },
    {
      provide: SUBTASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerSubtaskStorage() : new LocalSubtaskStorage();
      }),
    },
  ],
})
export class TaskDetail implements OnInit {
  private taskStorage = inject(TASK_STORAGE);
  private subtaskStorage = inject(SUBTASK_STORAGE);

  protected task!: WritableSignal<TaskDetailData>;
  protected groupRoles = GroupRole;

  protected subtasks: SubtaskData[] = [];

  protected readonly modal = inject(ModalService);
  protected formStateService = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);

  private router = inject(Router);
  private notificationService = inject(Notifier);

  @Input() protected projectId!: number | string;
  @Input() protected taskId!: number | string;

  @Output() protected lastPage: WritableSignal<number> = signal(1);

  ngOnInit(): void {
    this.taskStorage.getTask(this.projectId, this.taskId).subscribe({
      next: (response: TaskDetailData) => {
        this.task = signal(response);
        if (response.can_create_subtasks) {
          this.headerButtonService.update('New Subtask', FormType.Create);
        }
      }
    });

    this.subtaskStorage.getSubtasks(this.projectId, this.taskId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.subtasks = response.data;
      }
    })
  }

  protected showDeleteModal(): void {
    this.modal.generate(`Are you sure you want to delete ${this.task().title} ?`);
  }

  protected toggleUpdateForm(): void {
    this.formStateService.changeState(FormType.Update);
  }

  protected onSubtaskCreate(subtask: SubtaskData): void {
    this.subtaskStorage.getSubtasks(this.projectId, this.taskId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.subtasks = response.data;
      }
    })
  }

  protected onTaskUpdate(task: TaskData): void {
    this.toggleUpdateForm();

    const t = this.task();
    t.title = task.title;
    t.description = task.description;
    t.priority = task.priority;
    t.due_date = task.due_date;
    this.task.set(t);
  }

  protected onTaskDelete(): void {
    this.taskStorage.removeTask(this.projectId, this.taskId).subscribe({
      next: () => {
        this.notificationService.notify({
          type: NotificationType.Info,
          message: `Successfully deleted ${this.task().title}`
        });
        this.router.navigate(['projects', this.projectId]);
      }
    });
  }

  protected onPageChange(number: number): void {
    this.subtaskStorage.getSubtasks(this.projectId, this.taskId, number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.subtasks = response.data;
      }
    })
  }
}
