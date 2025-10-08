import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, WritableSignal, inject } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { InputDate } from '../../../../shared/components/input-date/input-date';
import { InputNumber } from '../../../../shared/components/input-number/input-number';
import { TASK_STORAGE } from '../../interfaces/task-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerTaskStorage } from '../../services/server-task-storage';
import { LocalTaskStorage } from '../../services/local-task-storage';
import { TaskData } from '../../interfaces/task-data';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notifier } from '../../../../shared/services/notifier';
import { FormState } from '../../../../shared/services/form-state';
import { priorityValidator } from '../../validators/priority-validator';
import { dueDateValidator } from '../../validators/due-date-validator';
import { FormType } from '../../../../shared/enums/form-type';
import { UpdateTaskData } from '../../interfaces/update-task-data';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { MessageResponse } from '../../../../shared/interfaces/message-response';

@Component({
  selector: 'app-update-task-form',
  imports: [ReactiveFormsModule, InputElement, InputNumber, InputDate, Button],
  templateUrl: './update-task-form.html',
  styleUrl: './update-task-form.css',
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
export class UpdateTaskForm implements OnChanges {
  @Input() task!: WritableSignal<TaskData>;
  @Input() projectId!: number | string;

  private formBuilder = inject(FormBuilder);
  updateTaskForm!: FormGroup;

  private storage = inject(TASK_STORAGE);

  protected isSubmitted: boolean = false;
  protected title!: any;
  protected description!: any;
  protected priority!: any;
  protected dueDate!: any;

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  @Output() submitted = new EventEmitter<TaskData>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task != null) {
      this.updateTaskForm = this.formBuilder.group({
        title: [this.task().title, Validators.required],
        description: [this.task().description, Validators.required],
        priority: [this.task().priority, priorityValidator()],
        dueDate: [this.task().due_date, dueDateValidator()],
      });
      this.title = this.updateTaskForm.get('title');
      this.description = this.updateTaskForm.get('description');
      this.priority = this.updateTaskForm.get('priority');
      this.dueDate = this.updateTaskForm.get('dueDate');
    }
  }

  protected cancelForm(): void {
    this.formState.changeState(FormType.Update);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.updateTaskForm.valid) {
      const { title, description, priority, dueDate } = this.updateTaskForm.value as {
        title: string,
        description: string,
        priority?: number,
        dueDate?: string,
      };

      const task: UpdateTaskData = {
        title,
        description,
        priority,
        due_date: dueDate,
      };

      this.storage.updateTask(this.projectId, this.task().id, task).subscribe({
        next: (response: MessageResponse) => {
          this.updateTaskForm.reset();
          this.updateTaskForm.markAsUntouched();
          this.isSubmitted = false;

          this.notificationService.notify({
            type: NotificationType.Info,
            message: response.message,
          });

          const updatedTask: TaskData = {
            id: this.task().id,
            title,
            description,
            priority: task.priority ?? null,
            due_date: task.due_date ?? null,
            completed: this.task().completed,
            completed_at: this.task().completed_at,
            created_at: this.task().created_at,
          };
          this.submitted.emit(updatedTask);
        },
        error: (response) => {
          if (response.status === 422) {
            if (response.error.hasOwnProperty('message')) {
              this.notificationService.notify({
                type: NotificationType.Error,
                message: response.error.message
              })
            }
          }
        }
      });
    }
  }
}
