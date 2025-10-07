import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ProjectData } from '../../interfaces/project-data';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { CreateProjectData } from '../../interfaces/create-project-data';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';

@Component({
  selector: 'app-create-project-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './create-project-form.html',
  styleUrl: './create-project-form.css',
  providers: [
    {
      provide: PROJECT_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerProjectStorage() : new LocalProjectStorage();
      }),
    },
  ],
})
export class CreateProjectForm {
  private formBuilder = inject(FormBuilder);
  createProjectForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  private storage = inject(PROJECT_STORAGE);

  protected isSubmitted: boolean = false;
  protected title = this.createProjectForm.get('title');
  protected description = this.createProjectForm.get('description');

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  @Input() groupId!: number | string;

  @Output() submitted = new EventEmitter<ProjectData>();

  protected cancelForm(): void {
    this.formState.changeState(FormType.Create);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.createProjectForm.valid) {
      const { title, description } = this.createProjectForm.value as {
        title: string,
        description: string,
      };

      const project: CreateProjectData = {
        name: title,
        description
      };

      if (this.groupId != null) {
        project.group_id = this.groupId;
      }

      this.storage.storeProject(project).subscribe({
        next: (response) => {
          this.createProjectForm.reset();
          this.createProjectForm.markAsUntouched();
          this.isSubmitted = false;

          const project: ProjectData = {
            id: response.data.id,
            name: title,
            description,
          };
          this.submitted.emit(project);
        },
        error: (error) => {
          if (error.status === 422) {
            if (error.error.errors.hasOwnProperty('name')) {
              this.notificationService.notify({
                message: 'You already have a project with that name.',
                type: NotificationType.Error,
              });
            }
          }
        }
      });
    }
  }
}
