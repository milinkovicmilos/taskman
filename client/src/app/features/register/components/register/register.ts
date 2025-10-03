import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RegisterForm } from '../register-form/register-form';
import { RegisterData } from '../../interfaces/register-data';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerError } from '../../../../shared/interfaces/server-error';

@Component({
  selector: 'app-register',
  imports: [RouterModule, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  authService = inject(AuthService);
  private router = inject(Router);

  protected serverErrors: WritableSignal<ServerError[]> = signal([]);

  onRegisterSubmit(data: RegisterData): void {
    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.serverErrors = signal([]);
        const errs: ServerError[] = [];
        const errorsObj = error.error.errors;
        for (const propertyName in errorsObj) {
          const errList = [];
          for (const error of errorsObj[propertyName]) {
            errList.push(error)
          }
          errs.push({
            property: propertyName,
            errors: errList,
          });
        }
        this.serverErrors.set(errs);
      }
    });
  }
}
