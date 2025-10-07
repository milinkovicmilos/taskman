import { Routes } from '@angular/router';
import { Home } from './features/home/components/home/home';
import { Register } from './features/register/components/register/register';
import { Login } from './features/login/components/login/login';
import { Logout } from './features/logout/components/logout/logout';
import { Project } from './features/projects/components/project/project';
import { authGuard } from './shared/guards/auth-guard';
import { unAuthGuard } from './shared/guards/un-auth-guard';
import { ProjectDetail } from './features/projects/components/project-detail/project-detail';
import { TaskDetail } from './features/tasks/components/task-detail/task-detail';
import { Group } from './features/groups/components/group/group';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [authGuard] },
  { path: 'logout', component: Logout, canActivate: [unAuthGuard] },
  { path: 'projects', component: Project },
  { path: 'projects/:id', component: ProjectDetail },
  { path: 'projects/:projectId/tasks/:taskId', component: TaskDetail },
  { path: 'groups', component: Group, canActivate: [unAuthGuard] },
];
