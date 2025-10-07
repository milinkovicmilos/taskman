import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtaskData } from '../../interfaces/subtask-data';
import { InputCheckbox } from '../../../../shared/components/input-checkbox/input-checkbox';

@Component({
  selector: 'app-subtask-card',
  imports: [InputCheckbox],
  templateUrl: './subtask-card.html',
  styleUrl: './subtask-card.css'
})
export class SubtaskCard {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() subtask!: SubtaskData;

  protected onClick(): void {
    this.router.navigate(['subtasks', this.subtask.id], { relativeTo: this.route });
  }
}
