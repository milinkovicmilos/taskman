import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectData } from '../../interfaces/project-data';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  @Input() project!: ProjectData;

  onClick() {
    // Project clicked
  }
}
