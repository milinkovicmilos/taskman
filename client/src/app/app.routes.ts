import { Routes } from '@angular/router';
import { Home } from './features/home/components/home/home';
import { Register } from './features/register/components/register/register';
import { Login } from './features/login/components/login/login';
import { Logout } from './features/logout/components/logout/logout';
import { Project } from './features/projects/components/project/project';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'projects', component: Project },
];
