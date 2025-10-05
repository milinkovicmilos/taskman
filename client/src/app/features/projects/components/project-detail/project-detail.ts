import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ProjectData, ProjectDetailData } from '../../interfaces/project-data';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ProjectRole } from '../../enums/project-role';
import { Button } from '../../../../shared/components/button/button';
import { TASK_STORAGE } from '../../../tasks/interfaces/task-storage';
import { ServerTaskStorage } from '../../../tasks/services/server-task-storage';
import { LocalTaskStorage } from '../../../tasks/services/local-task-storage';
import { TaskData } from '../../../tasks/interfaces/task-data';
import { TaskCard } from '../../../tasks/components/task-card/task-card';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { UpdateProjectForm } from '../update-project-form/update-project-form';
import { Modal } from '../../../../shared/services/modal';
import { Router } from '@angular/router';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { CreateTaskForm } from '../../../tasks/components/create-task-form/create-task-form';

@Component({
  selector: 'app-project-detail',
  imports: [Button, TaskCard, UpdateProjectForm, CreateTaskForm],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
  providers: [
    {
      provide: PROJECT_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerProjectStorage() : new LocalProjectStorage();
      }),
    },
    {
      provide: TASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerTaskStorage() : new LocalTaskStorage();
      }),
    },
  ],
})
export class ProjectDetail implements OnInit {
  private projectStorage = inject(PROJECT_STORAGE);
  private taskStorage = inject(TASK_STORAGE);

  protected project!: WritableSignal<ProjectDetailData>;
  protected projectRoles = ProjectRole;

  protected tasks: TaskData[] = [];

  private modal = inject(Modal);
  protected formStateService = inject(FormState);
  protected formTypes = FormType;

  private router = inject(Router);
  private notificationService = inject(Notifier);

  @Input() protected id!: number | string;

  ngOnInit(): void {
    this.projectStorage.getProject(this.id).subscribe({
      next: (response) => {
        this.project = signal(response);
      }
    });
    this.taskStorage.getTasks(this.id).subscribe({
      next: (response) => {
        this.tasks = response.data;
      }
    });

    this.modal.onConfirm().subscribe({
      next: (response) => {
        this.formStateService.changeState(FormType.Delete);
        if (response) {
          this.projectStorage.removeProject(this.id).subscribe({
            next: () => {
              this.notificationService.notify({
                type: NotificationType.Info,
                message: `Successfully deleted ${this.project().name}`
              });
              this.router.navigate(['projects']);
            }
          });
        }
      },
    });
  }

  protected toggleUpdateForm(): void {
    this.formStateService.changeState(FormType.Update);
  }

  protected toggleCreateForm(): void {
    this.formStateService.changeState(FormType.Create);
  }

  protected showDeleteModal(): void {
    this.formStateService.changeState(FormType.Delete);

    this.modal.generate(`Are you sure you want to delete ${this.project().name} ?`);
  }

  protected onProjectUpdate(project: ProjectData): void {
    this.toggleUpdateForm();

    const p = this.project();
    p.name = project.name;
    p.description = project.description;
    this.project.set(p);
  }

  protected onTaskCreate(task: TaskData) {
    this.toggleCreateForm();

    this.notificationService.notify({
      type: NotificationType.Info,
      message: `Successfully created task ${task.title}`,
    });

    this.taskStorage.getTasks(this.id).subscribe({
      next: (response) => {
        this.tasks = response.data;
      }
    });
  }
}
