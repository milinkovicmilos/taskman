import { Component } from '@angular/core';
import { ProjectCard } from '../project-card/project-card';
import { ProjectData } from '../../interfaces/project-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ProjectCard],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  projects: ProjectData[] = [
    { id: 1, title: 'Home', description: 'Tasks regarding home' },
    { id: 2, title: 'Guitar', description: 'Learning guitar' },
    { id: 3, title: 'Gardening', description: 'Taking care of garden' },
  ];

  deleteCard(id: number | string) {
    this.projects = this.projects.filter(x => x.id != id);
  }
}
