import { Component, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { TASK_STORAGE } from '../../interfaces/task-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerTaskStorage } from '../../services/server-task-storage';
import { LocalTaskStorage } from '../../services/local-task-storage';
import { TaskDetailData } from '../../interfaces/task-data';
import { Modal } from '../../../../shared/services/modal';
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
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-task-detail',
  imports: [Button, SubtaskCard, PageNavigation],
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

  private modal = inject(Modal);
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
      next: (response) => {
        this.task = signal(response);
        this.lastPage.set(response.last_page)
      }
    });

    this.subtaskStorage.getSubtasks(this.projectId, this.taskId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.subtasks = response.data;
      }
    })

    this.modal.onConfirm().pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.taskStorage.removeTask(this.projectId, this.taskId).pipe(take(1)).subscribe({
            next: () => {
              this.notificationService.notify({
                type: NotificationType.Info,
                message: `Successfully deleted ${this.task().title}`
              });
              this.router.navigate(['projects', this.projectId]);
            }
          });
        }
      },
    });
  }

  protected showDeleteModal(): void {
    this.modal.generate(`Are you sure you want to delete ${this.task().title} ?`);
  }

  protected toggleUpdateForm(): void {
    this.formStateService.changeState(FormType.Update);
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
