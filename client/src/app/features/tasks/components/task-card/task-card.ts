import { Component, Input, inject } from '@angular/core';
import { TaskData } from '../../interfaces/task-data';
import { DueDatePipe } from '../../pipes/due-date-pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputCheckbox } from '../../../../shared/components/input-checkbox/input-checkbox';

@Component({
  selector: 'app-task-card',
  imports: [InputCheckbox, DueDatePipe, CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() task!: TaskData;

  protected getDueDateClass(dueDate: string): string {
    const now = new Date();
    const date = new Date(dueDate);

    return now >= date ? 'late' : 'due';
  }

  protected onClick(): void {
    this.router.navigate(['tasks', this.task.id], { relativeTo: this.route });
  }
}
