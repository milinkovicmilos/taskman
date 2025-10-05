import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { TASK_STORAGE } from '../../interfaces/task-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerTaskStorage } from '../../services/server-task-storage';
import { LocalTaskStorage } from '../../services/local-task-storage';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notifier } from '../../../../shared/services/notifier';
import { FormState } from '../../../../shared/services/form-state';
import { TaskData } from '../../interfaces/task-data';
import { FormType } from '../../../../shared/enums/form-type';
import { CreateTaskData } from '../../interfaces/create-task-data';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { priorityValidator } from '../../validators/priority-validator';
import { InputNumber } from '../../../../shared/components/input-number/input-number';
import { dueDateValidator } from '../../validators/due-date-validator';
import { InputDate } from '../../../../shared/components/input-date/input-date';

@Component({
  selector: 'app-create-task-form',
  imports: [ReactiveFormsModule, InputElement, InputNumber, InputDate, Button],
  templateUrl: './create-task-form.html',
  styleUrl: './create-task-form.css',
  providers: [
    {
      provide: TASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerTaskStorage() : new LocalTaskStorage();
      }),
    },
  ],
})
export class CreateTaskForm {
  private formBuilder = inject(FormBuilder);
  createTaskForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [null, priorityValidator()],
    dueDate: [null, dueDateValidator()],
  });

  private storage = inject(TASK_STORAGE);

  protected isSubmitted: boolean = false;
  protected title = this.createTaskForm.get('title');
  protected description = this.createTaskForm.get('description');
  protected priority = this.createTaskForm.get('priority');
  protected dueDate = this.createTaskForm.get('dueDate');

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  protected dueDateMin = (new Date()).toISOString().split('T')[0];

  @Input() projectId!: number | string;
  @Output() submitted = new EventEmitter<TaskData>();

  protected cancelForm(): void {
    this.formState.changeState(FormType.Create);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.createTaskForm.valid) {
      const { title, description, priority, dueDate } = this.createTaskForm.value as {
        title: string,
        description: string,
        priority?: number | null,
        dueDate?: string | null,
      };

      const task: CreateTaskData = {
        title,
        description,
        priority: priority ?? null,
        due_date: dueDate ?? null,
      };

      this.storage.storeTask(this.projectId, task).subscribe({
        next: (response) => {
          this.createTaskForm.reset();
          this.createTaskForm.markAsUntouched();
          this.isSubmitted = false;

          const taskData: TaskData = {
            id: response.data.id,
            title,
            description,
            priority: task.priority ?? null,
            due_date: task.due_date ?? null,
            completed: false,
            completed_at: null,
          };
          this.submitted.emit(taskData);
        },
        error: (error) => {
          if (error.status === 422) {
            if (error.error.errors.hasOwnProperty('name')) {
              console.log(error.error.errors)
            }
          }
        }
      });
    }
  }
}
