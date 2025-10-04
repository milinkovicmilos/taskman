import { Component, Input } from '@angular/core';
import { TaskData } from '../../interfaces/task-data';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {
  @Input() task!: TaskData;
}
