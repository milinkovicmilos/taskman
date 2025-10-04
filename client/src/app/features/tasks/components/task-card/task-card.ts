import { Component, Input } from '@angular/core';
import { TaskData } from '../../interfaces/task-data';
import { DueDatePipe } from '../../pipes/due-date-pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [DueDatePipe, CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {
  @Input() task!: TaskData;

  protected getDueDateClass(dueDate: string): string {
    const now = new Date();
    const date = new Date(dueDate);

    return now >= date ? 'late' : 'due';
  }
}
