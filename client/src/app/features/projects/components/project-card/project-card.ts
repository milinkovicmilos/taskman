import { Component, EventEmitter, Input, inject } from '@angular/core';
import { ProjectData } from '../../interfaces/project-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {
  private router = inject(Router);
  @Input() project!: ProjectData;

  onClick() {
    this.router.navigate(['projects', this.project.id]);
  }
}
