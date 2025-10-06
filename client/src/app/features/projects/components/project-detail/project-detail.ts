import { Component, Input, OnInit, Output, WritableSignal, inject, signal } from '@angular/core';
import { ProjectData, ProjectDetailData } from '../../interfaces/project-data';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { Button } from '../../../../shared/components/button/button';
import { TASK_STORAGE } from '../../../tasks/interfaces/task-storage';
import { ServerTaskStorage } from '../../../tasks/services/server-task-storage';
import { LocalTaskStorage } from '../../../tasks/services/local-task-storage';
import { TaskData } from '../../../tasks/interfaces/task-data';
import { TaskCard } from '../../../tasks/components/task-card/task-card';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { UpdateProjectForm } from '../update-project-form/update-project-form';
import { Modal as ModalService } from '../../../../shared/services/modal';
import { Modal } from '../../../../shared/components/modal/modal';
import { Router } from '@angular/router';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { CreateTaskForm } from '../../../tasks/components/create-task-form/create-task-form';
import { HeaderButton } from '../../../../shared/services/header-button';
import { take } from 'rxjs';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { GroupRole } from '../../../groups/enums/group-role';

@Component({
  selector: 'app-project-detail',
  imports: [Modal, Button, TaskCard, UpdateProjectForm, CreateTaskForm, PageNavigation],
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
  protected groupRoles = GroupRole;

  protected tasks: TaskData[] = [];

  protected readonly modal = inject(ModalService);
  protected formStateService = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);

  private router = inject(Router);
  private notificationService = inject(Notifier);

  @Input() protected id!: number | string;

  @Output() protected lastPage: WritableSignal<number> = signal(1);

  ngOnInit(): void {
    this.projectStorage.getProject(this.id).subscribe({
      next: (response) => {
        this.project = signal(response);

        const role = this.project().role;
        if (role === GroupRole.Owner || role === GroupRole.Moderator) {
          this.headerButtonService.update('New Task', FormType.Create);
        }
      }
    });

    this.taskStorage.getTasks(this.id).subscribe({
      next: (response) => {
        this.tasks = response.data;
        this.lastPage.set(response.last_page)
      }
    });
  }

  protected toggleUpdateForm(): void {
    this.formStateService.changeState(FormType.Update);
  }

  protected toggleCreateForm(): void {
    this.formStateService.changeState(FormType.Create);
  }

  protected showDeleteModal(): void {
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

  protected onProjectDelete(): void {
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

  onPageChange(number: number) {
    this.taskStorage.getTasks(this.id, number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.tasks = response.data;
      }
    })
  }
}
