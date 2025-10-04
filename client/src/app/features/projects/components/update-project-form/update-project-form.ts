import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notifier } from '../../../../shared/services/notifier';
import { ProjectData } from '../../interfaces/project-data';
import { CreateProjectData } from '../../interfaces/create-project-data';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { UpdateProjectData } from '../../interfaces/update-project-data';

@Component({
  selector: 'app-update-project-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './update-project-form.html',
  styleUrl: './update-project-form.css',
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
export class UpdateProjectForm implements OnChanges {
  @Input() project!: ProjectData;

  private formBuilder = inject(FormBuilder);
  createProjectForm!: FormGroup;

  private storage = inject(PROJECT_STORAGE);

  protected isSubmitted: boolean = false;
  protected name!: any;
  protected description!: any;

  private notificationService = inject(Notifier);

  @Output() submitted = new EventEmitter<ProjectData>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project != null) {
      this.createProjectForm = this.formBuilder.group({
        name: [this.project.name, Validators.required],
        description: [this.project.description, Validators.required],
      });
      this.name = this.createProjectForm.get('name');
      this.description = this.createProjectForm.get('description');
    }
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.createProjectForm.valid) {
      const { name, description } = this.createProjectForm.value as {
        name: string,
        description: string,
      };

      const project: UpdateProjectData = {
        name,
        description
      };

      this.storage.updateProject(this.project.id, project).subscribe({
        next: (response) => {
          this.createProjectForm.reset();
          this.createProjectForm.markAsUntouched();
          this.isSubmitted = false;

          const project: ProjectData = {
            id: response.data.id,
            name,
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
