import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { FormState } from '../../services/form-state';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  state = inject(FormState);

  toggleNewProjectForm() {
    this.state.changeState();
  }
}
