import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { ProjectData } from '../../interfaces/project-data';

@Component({
  selector: 'app-project-card',
  imports: [Button],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  @Input() project!: ProjectData;

  @Output() deleted: EventEmitter<number | string> = new EventEmitter<number | string>();

  onClick() {
    // Project clicked
  }

  onDeleteClick() {
    this.deleted.emit(this.project.id);
  }
}
