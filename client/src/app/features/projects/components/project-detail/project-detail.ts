import { Component, Input, OnInit, inject } from '@angular/core';
import { ProjectDetailData } from '../../interfaces/project-data';
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

@Component({
  selector: 'app-project-detail',
  imports: [Button, TaskCard],
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

  protected project!: ProjectDetailData;
  protected projectRoles = ProjectRole;

  protected tasks: TaskData[] = [];

  @Input() protected id!: number | string;

  ngOnInit(): void {
    this.projectStorage.getProject(this.id).subscribe({
      next: (response) => {
        this.project = response;
      }
    });
    this.taskStorage.getTasks(this.id).subscribe({
      next: (response) => {
        this.tasks = response.data;
      }
    });
  }
}
